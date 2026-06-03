import request from 'supertest';
import { server } from './setup.js';
import { UserService } from '../services/UserService.js';
import { UserRole } from '../enums/UserRole.js';
import { beforeAll, describe, expect, it } from 'vitest';

describe('Company API', () => {
    let token: string;
    const companyPayload = { name: 'TestCorp' };
    const updatedPayload = { name: 'UpdatedCorp' };

    beforeAll(async () => {
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

    it('should create a company', async () => {
        const res = await request(server)
            .post('/api/companies')
            .set('Authorization', `Bearer ${token}`)
            .send(companyPayload)
            .expect(201);
        expect(res.body).toMatchObject(companyPayload);
        (global as any).__companyId = res.body.id;
    });

    it('should list companies', async () => {
        const res = await request(server)
            .get('/api/companies')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('should show a single company', async () => {
        const id = (global as any).__companyId;
        const res = await request(server)
            .get(`/api/companies/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(res.body).toMatchObject(companyPayload);
    });

    it('should update a company', async () => {
        const id = (global as any).__companyId;
        const res = await request(server)
            .put(`/api/companies/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedPayload)
            .expect(200);
        expect(res.body).toMatchObject(updatedPayload);
    });

    it('should soft-delete a company', async () => {
        const id = (global as any).__companyId;
        await request(server)
            .delete(`/api/companies/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204);
    });

    it('should restore a soft-deleted company', async () => {
        const id = (global as any).__companyId;
        await request(server)
            .post(`/api/companies/${id}/restore`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
    });

    it('should force-delete a company (admin only)', async () => {
        const id = (global as any).__companyId;
        await request(server)
            .delete(`/api/companies/${id}/force`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204);
    });
});
