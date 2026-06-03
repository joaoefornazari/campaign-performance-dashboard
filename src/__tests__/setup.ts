process.env.NODE_ENV = 'test';
import 'reflect-metadata';
import { AppDataSource } from '../database/data-source.js';

if (!AppDataSource.isInitialized) {
  await AppDataSource.initialize();
}

import request from 'supertest';
import app from '../index.js';

export const server = app;
export const api = request(app);
