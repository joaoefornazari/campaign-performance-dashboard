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
import { UserRole } from '../enums/UserRole.js';
import { Campaign } from './Campaign.js';

@Entity('users')
@Check("users_role_check", "role IN ('admin', 'standard')")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column({ type: 'timestamp', nullable: true })
  email_verified_at?: Date | null;

  @Column({ type: 'varchar' })
  password!: string;

  @Column({ type: 'varchar', name: 'remember_token', nullable: true })
  remember_token?: string | null;

  @Column({
    type: 'varchar',
    default: UserRole.Standard
  })
  role!: UserRole;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updated_at?: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at?: Date | null;

  @OneToMany(() => Campaign, (campaign) => campaign.user)
  campaigns!: Campaign[];
}
