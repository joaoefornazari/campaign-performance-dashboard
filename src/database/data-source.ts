import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { User } from '../entities/User.js';
import { Platform } from '../entities/Platform.js';
import { Campaign } from '../entities/Campaign.js';
import { PersonalAccessToken } from '../entities/PersonalAccessToken.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const isTest = process.env.NODE_ENV === 'test';
const dbDatabase = isTest ? 'skyhouse_test' : (process.env.DB_DATABASE || 'skyhouse');

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || '/var/run/postgresql',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'joaoe',
  password: process.env.DB_PASSWORD || '',
  database: dbDatabase,
  synchronize: isTest, // Auto sync schema in test mode
  dropSchema: isTest, // Drop schema in test mode for a clean state
  logging: false,
  entities: [User, Platform, Campaign, PersonalAccessToken],
  migrations: isTest ? [] : [path.join(__dirname, 'migrations/[0-9]*.ts')],
  subscribers: [],
});
