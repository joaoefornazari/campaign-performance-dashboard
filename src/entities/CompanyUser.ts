import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { User } from './User.js';
import { Company } from './Company.js';

@Entity('company_user')
export class CompanyUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'integer', name: 'company_id' })
  company_id!: number;

  @Column({ type: 'integer', name: 'user_id' })
  user_id!: number;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  created_at?: Date;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company!: Company;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
