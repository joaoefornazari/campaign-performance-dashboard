import { AppDataSource } from '../database/data-source.js';
import { StockPriceCache } from '../entities/StockPriceCache.js';

export class StockCacheRepository {
  private repo = AppDataSource.getRepository(StockPriceCache);

  async upsert(ticker: string, date: string, close: number): Promise<void> {
    const existing = await this.repo.findOne({
      where: { ticker_symbol: ticker, price_date: date }
    });

    if (existing) {
      existing.adjusted_close = close;
      await this.repo.save(existing);
    } else {
      await this.repo.save(
        this.repo.create({
          ticker_symbol: ticker,
          price_date: date,
          adjusted_close: close
        })
      );
    }
  }

  async findByTickerAndDate(ticker: string, date: string): Promise<StockPriceCache | null> {
    return await this.repo.findOne({
      where: { ticker_symbol: ticker, price_date: date }
    });
  }

  async findLatestByTicker(ticker: string): Promise<StockPriceCache | null> {
    return await this.repo.findOne({
      where: { ticker_symbol: ticker },
      order: { price_date: 'DESC' }
    });
  }

  async findClosestToDate(ticker: string, date: Date): Promise<StockPriceCache | null> {
    const results = await this.repo.find({
      where: { ticker_symbol: ticker },
      order: { price_date: 'DESC' }
    });

    if (results.length === 0) return null;

    let closest = results[0];
    let minDiff = Math.abs(new Date(closest.price_date).getTime() - date.getTime());

    for (const r of results) {
      const diff = Math.abs(new Date(r.price_date).getTime() - date.getTime());
      if (diff < minDiff) {
        minDiff = diff;
        closest = r;
      }
    }

    return closest;
  }

  async findAllByTicker(ticker: string): Promise<StockPriceCache[]> {
    return await this.repo.find({
      where: { ticker_symbol: ticker },
      order: { price_date: 'ASC' }
    });
  }
}
