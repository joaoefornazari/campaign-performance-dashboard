import 'reflect-metadata';
import request from 'supertest';
import app from '../index.js';

export const server = app;
export const api = request(app);
