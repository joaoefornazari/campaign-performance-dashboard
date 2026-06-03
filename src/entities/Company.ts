import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany
} from 'typeorm';
import { Campaign } from './Campaign.js';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', unique: true })
  name!: string;

  @Column({ type: 'varchar', name: 'ticker_symbol', nullable: true })
  ticker_symbol?: string | null;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updated_at?: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at?: Date | null;

  @OneToMany(() => Campaign, (campaign) => campaign.company)
  campaigns!: Campaign[];
}
