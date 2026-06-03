// src/__tests__/userRoleAuthorization.test.ts
import request from 'supertest';
import { server } from './setup.js';
import { UserService } from '../services/UserService.js';
import { UserRole } from '../enums/UserRole.js';
import { beforeAll, describe, it } from 'vitest';

describe('User Role Authorization (admin gate)', () => {
    let adminToken: string;
    let userToken: string;
    const emailSuffix = Date.now();

    beforeAll(async () => {
        const userService = new UserService();

        // admin
        const adminEmail = 'admin@example.com';
        const adminPass = 'admin123';
        let admin = await userService.findByEmail(adminEmail);
        if (!admin) {
            admin = await userService.create({
                name: 'Admin',
                email: adminEmail,
                password: adminPass,
                role: UserRole.Admin,
            });
        }
        const adminLogin = await request(server)
            .post('/api/login')
            .send({ email: adminEmail, password: adminPass })
            .expect(200);
        adminToken = adminLogin.body.token;

        // standard user
        const userEmail = 'user@example.com';
        const userPass = 'user123';
        let user = await userService.findByEmail(userEmail);
        if (!user) {
            user = await userService.create({
                name: 'User',
                email: userEmail,
                password: userPass,
                role: UserRole.Standard,
            });
        }
        const userLogin = await request(server)
            .post('/api/login')
            .send({ email: userEmail, password: userPass })
            .expect(200);
        userToken = userLogin.body.token;
    });

    it('admin can force‑delete a user', async () => {
        const res = await request(server)
            .post('/api/users')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Tmp', email: `tmp-${emailSuffix}@example.com`, password: 'tmp12345' })
            .expect(201);
        const id = res.body.id;

        await request(server)
            .delete(`/api/users/${id}/force`)
            .set('Authorization', `Bearer ${adminToken}`)
            .expect(204);
    });

    it('standard user cannot force‑delete a user', async () => {
        const res = await request(server)
            .post('/api/users')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ name: 'Tmp2', email: `tmp2-${emailSuffix}@example.com`, password: 'tmp12345' })
            .expect(201);
        const id = res.body.id;

        await request(server)
            .delete(`/api/users/${id}/force`)
            .set('Authorization', `Bearer ${userToken}`)
            .expect(403);
    });
});
