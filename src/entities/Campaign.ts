import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Check
} from 'typeorm';
import { Platform } from './Platform.js';
import { User } from './User.js';

@Entity('campaigns')
@Check("campaigns_name_min_length", "char_length(name) >= 10")
@Check("campaigns_spend_min", "spend >= 0")
@Check("campaigns_revenue_min", "revenue >= 0")
@Check("campaigns_conversions_min", "conversions >= 0")
export class Campaign {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 20, name: 'external_id', nullable: true })
  external_id?: string;

  @Column({ type: 'varchar', length: 200 })
  name!: string;

  @Column({ type: 'float' })
  spend!: number;

  @Column({ type: 'float' })
  revenue!: number;

  @Column({ type: 'integer' })
  conversions!: number;

  @Column({ type: 'integer', name: 'platform_id' })
  platform_id!: number;

  @Column({ type: 'integer', name: 'user_id' })
  user_id!: number;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updated_at?: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at?: Date | null;

  @ManyToOne(() => Platform, (platform) => platform.campaigns, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'platform_id' })
  platform!: Platform;

  @ManyToOne(() => User, (user) => user.campaigns, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
  })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
