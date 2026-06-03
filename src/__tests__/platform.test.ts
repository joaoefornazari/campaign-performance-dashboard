import request from 'supertest';
import { server } from './setup.js';
import { UserService } from '../services/UserService.js';
import { UserRole } from '../enums/UserRole.js';
import { beforeAll, describe, expect, it } from 'vitest';

describe('Platform API', () => {
    let token: string;
    const platformPayload = { name: 'Test Platform' };
    const updatedPayload = { name: 'Updated Platform' };

    beforeAll(async () => {
        // create an admin user and obtain a JWT‑like token
        const userService = new UserService();
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
        const loginRes = await request(server)
            .post('/api/login')
            .send({ email: adminEmail, password: adminPass })
            .expect(200);
        token = loginRes.body.token;
    });

    it('should create a platform (admin)', async () => {
        const res = await request(server)
            .post('/api/platforms')
            .set('Authorization', `Bearer ${token}`)
            .send(platformPayload)
            .expect(201);
        expect(res.body).toMatchObject(platformPayload);
        (global as any).__platformId = res.body.id; // store for later
    });

    it('should list platforms', async () => {
        const res = await request(server)
            .get('/api/platforms')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should show a single platform', async () => {
        const id = (global as any).__platformId;
        const res = await request(server)
            .get(`/api/platforms/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(res.body).toMatchObject(platformPayload);
    });

    it('should update a platform', async () => {
        const id = (global as any).__platformId;
        const res = await request(server)
            .put(`/api/platforms/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedPayload)
            .expect(200);
        expect(res.body).toMatchObject(updatedPayload);
    });

    it('should soft‑delete a platform', async () => {
        const id = (global as any).__platformId;
        await request(server)
            .delete(`/api/platforms/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204);
    });

    it('should restore a soft‑deleted platform', async () => {
        const id = (global as any).__platformId;
        await request(server)
            .post(`/api/platforms/${id}/restore`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
    });

    it('should force‑delete a platform (admin only)', async () => {
        const id = (global as any).__platformId;
        await request(server)
            .delete(`/api/platforms/${id}/force`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204);
    });
});
