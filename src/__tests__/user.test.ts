// src/__tests__/user.test.ts
import request from 'supertest';
import { server } from './setup.js';
import { beforeAll, describe, expect, it } from 'vitest';
import { UserRole } from '../enums/UserRole.js';

describe('User API', () => {
  let token: string;

  beforeAll(async () => {
    // Ensure an admin user exists and obtain token
    const adminEmail = 'admin@example.com';
    const adminPass = 'admin123';
    // Create admin user directly via service (bypass API)
    const { UserService } = await import('../services/UserService.js');
    const userService = new UserService();
    let admin = await userService.findByEmail(adminEmail);
    if (!admin) {
      admin = await userService.create({ name: 'Admin', email: adminEmail, password: adminPass, role: UserRole.Admin });
    }
    // Login to get token
    const res = await request(server)
      .post('/api/login')
      .send({ email: adminEmail, password: adminPass })
      .expect(200);
    token = res.body.token;
  });

  it('should list users (authorized)', async () => {
    await request(server)
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });
});
