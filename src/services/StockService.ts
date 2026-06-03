import { StockCacheRepository } from '../repositories/StockCacheRepository.js';
import { CompanyRepository } from '../repositories/CompanyRepository.js';

const ALPHAVANTAGE_BASE = 'https://www.alphavantage.co/query';

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

    if (company.ticker_symbol) return company.ticker_symbol;

    const apiKey = this.getApiKey();
    const url = `${ALPHAVANTAGE_BASE}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(company.name)}&apikey=${apiKey}`;

    let data: any;
    try {
      const res = await fetch(url);
      data = await res.json();
    } catch {
      return null;
    }

    const matches = data?.bestMatches;
    if (!matches || matches.length === 0) return null;

    const bestMatch = matches[0];
    const ticker = bestMatch['1. symbol'] || null;

    if (ticker) {
      company.ticker_symbol = ticker;
      await this.companyRepo.update(company, { ticker_symbol: ticker });
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
    } catch {
      return;
    }

    const series = data?.['Monthly Adjusted Time Series'];
    if (!series) return;

    for (const [dateStr, values] of Object.entries(series)) {
      const close = parseFloat((values as any)['5. adjusted close']);
      if (!isNaN(close)) {
        await this.stockCacheRepo.upsert(ticker, dateStr, close);
      }
    }
  }

  async fetchAndCacheForCompany(companyId: number): Promise<void> {
    const ticker = await this.lookupAndCacheTicker(companyId);
    if (!ticker) return;
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
