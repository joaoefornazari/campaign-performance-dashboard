// src/__tests__/campaign.test.ts
import request from 'supertest';
import { server } from './setup.js';
import { UserService } from '../services/UserService.js';
import { UserRole } from '../enums/UserRole.js';
import { beforeAll, describe, expect, it } from 'vitest';

describe('Campaign API', () => {
    let token: string;
    const payload = {
        name: 'Test Campaign',
        spend: 1000,
        revenue: 5000,
        conversions: 20,
        platform_id: 1,
        user_id: 1,
    };

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
        const login = await request(server)
            .post('/api/login')
            .send({ email: adminEmail, password: adminPass })
            .expect(200);
        token = login.body.token;
    });

    it('creates a campaign', async () => {
        const res = await request(server)
            .post('/api/campaigns')
            .set('Authorization', `Bearer ${token}`)
            .send(payload)
            .expect(201);
        expect(res.body).toMatchObject({ name: payload.name });
        (global as any).__campaignId = res.body.id;
    });

    it('lists campaigns', async () => {
        const res = await request(server)
            .get('/api/campaigns')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(Array.isArray(res.body.data)).toBe(true);
    });

    it('shows a campaign', async () => {
        const id = (global as any).__campaignId;
        const res = await request(server)
            .get(`/api/campaigns/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
        expect(res.body).toMatchObject({ name: payload.name });
    });

    it('updates a campaign', async () => {
        const id = (global as any).__campaignId;
        const updated = { ...payload, name: 'Updated Campaign' };
        const res = await request(server)
            .put(`/api/campaigns/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updated)
            .expect(200);
        expect(res.body).toMatchObject({ name: 'Updated Campaign' });
    });

    it('soft deletes a campaign', async () => {
        const id = (global as any).__campaignId;
        await request(server)
            .delete(`/api/campaigns/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204);
    });

    it('restores a soft‑deleted campaign', async () => {
        const id = (global as any).__campaignId;
        await request(server)
            .post(`/api/campaigns/${id}/restore`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);
    });

    it('force deletes a campaign (admin only)', async () => {
        const id = (global as any).__campaignId;
        await request(server)
            .delete(`/api/campaigns/${id}/force`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204);
    });
});
