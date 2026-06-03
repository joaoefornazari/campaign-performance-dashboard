import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index
} from 'typeorm';

@Entity('stock_price_cache')
@Index(['ticker_symbol', 'price_date'], { unique: true })
export class StockPriceCache {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', name: 'ticker_symbol' })
  ticker_symbol!: string;

  @Column({ type: 'date', name: 'price_date' })
  price_date!: string;

  @Column({ type: 'float', name: 'adjusted_close' })
  adjusted_close!: number;

  @CreateDateColumn({ name: 'cached_at', nullable: true })
  cached_at?: Date;
}
