import { StockCacheRepository } from '../repositories/StockCacheRepository.js';
import { CompanyRepository } from '../repositories/CompanyRepository.js';

const ALPHAVANTAGE_BASE = 'https://www.alphavantage.co/query';

const TICKER_OVERRIDES: Record<string, string> = {
  'Apple': 'AAPL',
  'Tesla': 'TSLA',
  'Amazon': 'AMZN',
  'Netflix': 'NFLX',
  'Microsoft': 'MSFT',
  'Google': 'GOOGL',
  'Meta': 'META',
};

export class StockService {
  constructor(
    private stockCacheRepo = new StockCacheRepository(),
    private companyRepo = new CompanyRepository()
  ) {}

  private getApiKey(): string {
    const key = process.env.ALPHAVANTAGE_API_KEY;
    if (!key) {
      throw new Error('ALPHAVANTAGE_API_KEY is not set in environment variables.');
    }
    return key;
  }

  async lookupAndCacheTicker(companyId: number): Promise<string | null> {
    const company = await this.companyRepo.findById(companyId);
    if (!company) return null;

    const override = TICKER_OVERRIDES[company.name];
    if (override) {
      if (company.ticker_symbol !== override) {
        company.ticker_symbol = override;
        await this.companyRepo.update(company, { ticker_symbol: override });
        console.log(`[StockService] Applied ticker override: ${company.name} -> ${override} (was ${company.ticker_symbol ?? 'none'})`);
      }
      return override;
    }

    if (company.ticker_symbol) return company.ticker_symbol;

    const apiKey = this.getApiKey();
    const url = `${ALPHAVANTAGE_BASE}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(company.name)}&apikey=${apiKey}`;

    let data: any;
    try {
      const res = await fetch(url);
      data = await res.json();
    } catch (err) {
      console.error(`[StockService] Network error fetching ticker for company ${company.name}:`, err);
      return null;
    }

    const matches = data?.bestMatches;
    if (!matches || matches.length === 0) {
      if (data?.Note) console.warn(`[StockService] AlphaVantage note for ${company.name}:`, data.Note);
      if (data?.Information) console.warn(`[StockService] AlphaVantage info for ${company.name}:`, data.Information);
      return null;
    }

    const usEquity = matches.filter((m: any) =>
      m['4. region'] === 'United States' && m['3. type'] === 'Equity'
    );

    const candidates = usEquity.length > 0 ? usEquity : matches;

    candidates.sort((a: any, b: any) => parseFloat(b['9. matchScore']) - parseFloat(a['9. matchScore']));

    const bestMatch = candidates[0];
    const ticker = bestMatch['1. symbol'] || null;

    if (ticker) {
      company.ticker_symbol = ticker;
      await this.companyRepo.update(company, { ticker_symbol: ticker });
      console.log(`[StockService] Ticker resolved: ${company.name} -> ${ticker}`);
    }

    return ticker;
  }

  async fetchMonthlyData(ticker: string): Promise<void> {
    const apiKey = this.getApiKey();
    const url = `${ALPHAVANTAGE_BASE}?function=TIME_SERIES_MONTHLY_ADJUSTED&symbol=${encodeURIComponent(ticker)}&apikey=${apiKey}`;

    let data: any;
    try {
      const res = await fetch(url);
      data = await res.json();
    } catch (err) {
      console.error(`[StockService] Network error fetching monthly data for ${ticker}:`, err);
      return;
    }

    if (data?.Note) {
      console.warn(`[StockService] AlphaVantage note for ${ticker}:`, data.Note);
      return;
    }
    if (data?.Information) {
      console.warn(`[StockService] AlphaVantage info for ${ticker}:`, data.Information);
      return;
    }

    const series = data?.['Monthly Adjusted Time Series'];
    if (!series) {
      console.warn(`[StockService] No monthly data for ${ticker}:`, JSON.stringify(data).slice(0, 200));
      return;
    }

    let count = 0;
    for (const [dateStr, values] of Object.entries(series)) {
      const close = parseFloat((values as any)['5. adjusted close']);
      if (!isNaN(close)) {
        await this.stockCacheRepo.upsert(ticker, dateStr, close);
        count++;
      }
    }
    console.log(`[StockService] Cached ${count} monthly data points for ${ticker}`);
  }

  async fetchAndCacheForCompany(companyId: number): Promise<void> {
    const ticker = await this.lookupAndCacheTicker(companyId);
    if (!ticker) {
      console.warn(`[StockService] Could not resolve ticker for company ID ${companyId}, skipping.`);
      return;
    }
    await this.fetchMonthlyData(ticker);
  }

  async getVariation(
    ticker: string,
    startDate: Date
  ): Promise<{ variation: number | null; latest_close: number | null }> {
    const latest = await this.stockCacheRepo.findLatestByTicker(ticker);
    if (!latest) {
      return { variation: null, latest_close: null };
    }

    const closest = await this.stockCacheRepo.findClosestToDate(ticker, startDate);
    if (!closest || closest.id === latest.id) {
      return { variation: null, latest_close: latest.adjusted_close };
    }

    const variation = ((latest.adjusted_close - closest.adjusted_close) / closest.adjusted_close) * 100;

    return {
      variation: Math.round(variation * 100) / 100,
      latest_close: latest.adjusted_close
    };
  }
}
