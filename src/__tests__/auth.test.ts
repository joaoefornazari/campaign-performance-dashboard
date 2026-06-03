import request from 'supertest';
import { server } from './setup.js';
import { UserService } from '../services/UserService.js';
import { beforeAll, describe, expect, it } from 'vitest';

describe('Auth API', () => {
  const userService = new UserService();
  const testUser = { name: 'Test User', email: 'test@example.com', password: 'secret123' };

  beforeAll(async () => {
    // Ensure user exists
    const existing = await userService.findByEmail(testUser.email);
    if (!existing) {
      await userService.create({ ...testUser, password: testUser.password }); // password will be hashed in service
    }
  });

  it('should login with valid credentials', async () => {
    const res = await request(server)
      .post('/api/login')
      .send({ email: testUser.email, password: testUser.password })
      .expect(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
  });

  it('should reject invalid credentials', async () => {
    await request(server)
      .post('/api/login')
      .send({ email: testUser.email, password: 'wrong' })
      .expect(401);
  });

  it('should rate limit after 5 login attempts per minute', async () => {
    const maxAttempts = 15;
    let rateLimited = false;

    for (let i = 0; i < maxAttempts; i++) {
      const res = await request(server)
        .post('/api/login')
        .send({ email: testUser.email, password: testUser.password });

      if (res.status === 429) {
        expect(res.body).toEqual({ message: 'Too Many Attempts.' });
        rateLimited = true;
        break;
      }
    }

    expect(rateLimited).toBe(true);
  });
});
