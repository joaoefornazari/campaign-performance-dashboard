import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
  Check
} from 'typeorm';
import { Campaign } from './Campaign.js';

@Entity('platforms')
@Check("platforms_name_min_length", "char_length(name) >= 2")
export class Platform {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 20 })
  name!: string;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updated_at?: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at?: Date | null;

  @OneToMany(() => Campaign, (campaign) => campaign.platform)
  campaigns!: Campaign[];
}
