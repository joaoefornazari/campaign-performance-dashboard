import request from 'supertest';
import { server } from './setup.js';
import { describe, expect, it } from 'vitest';

describe('Pages', () => {
  it('GET / should redirect to /login', async () => {
    const res = await request(server).get('/');
    expect(res.status).toBe(302);
    expect(res.headers.location).toBe('/login');
  });

  it('GET /login should render login page', async () => {
    const res = await request(server).get('/login');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Sign in to your account');
    expect(res.text).toContain('email');
    expect(res.text).toContain('password');
  });

  it('GET /dashboard should render dashboard page', async () => {
    const res = await request(server).get('/dashboard');
    expect(res.status).toBe(200);
    expect(res.text).toContain('Welcome!');
  });
});
