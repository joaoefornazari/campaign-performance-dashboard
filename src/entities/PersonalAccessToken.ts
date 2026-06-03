import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity('personal_access_tokens')
export class PersonalAccessToken {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: 'App\\Models\\User' })
  tokenable_type!: string;

  @Column({ name: 'tokenable_id' })
  tokenable_id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  token!: string;

  @Column({ type: 'text', nullable: true })
  abilities?: string | null;

  @Column({ type: 'timestamp', nullable: true, name: 'last_used_at' })
  last_used_at?: Date | null;

  @Column({ type: 'timestamp', nullable: true, name: 'expires_at' })
  expires_at?: Date | null;

  @CreateDateColumn({ name: 'created_at', nullable: true })
  created_at?: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updated_at?: Date;
}
