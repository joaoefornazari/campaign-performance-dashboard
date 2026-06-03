process.env.NODE_ENV = 'test';
import 'reflect-metadata';
import { AppDataSource } from '../database/data-source.js';

if (!AppDataSource.isInitialized) {
  await AppDataSource.initialize();
}

// Clean all tables to ensure a fresh state before each test run
const entities = AppDataSource.entityMetadatas;
const tableNames = entities.map((e) => `"${e.tableName}"`).join(', ');
if (tableNames) {
  await AppDataSource.query(`TRUNCATE ${tableNames} CASCADE;`);
}

import request from 'supertest';
import app from '../index.js';

export const server = app;
export const api = request(app);
