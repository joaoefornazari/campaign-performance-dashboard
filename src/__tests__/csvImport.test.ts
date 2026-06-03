import request from 'supertest';
import { server } from './setup.js';
import { UserService } from '../services/UserService.js';
import { UserRole } from '../enums/UserRole.js';
import { beforeAll, describe, expect, it } from 'vitest';

const VALID_CSV = `campaign_id,campaign_name,spend,revenue,conversions,platform,company,start_date
C001,Wrinkle Cream FB,4200.00,18900.00,312,Facebook,BeautyInc,2025-06-01
C002,Weight Loss IG,3100.50,8680.00,198,Instagram,BeautyInc,2025-08-15
C003,Zepbound Google,5500.00,24750.00,440,Google,PharmaCorp,2025-11-20
`;

const WRONG_HEADER_CSV = `id,name,spend,revenue,conversions,platform
1,Wrinkle Cream FB,4200.00,18900.00,312,Facebook
`;

const EMPTY_CSV = `campaign_id,campaign_name,spend,revenue,conversions,platform,company,start_date
`;

describe('CSV Import', () => {
    let token: string;
    let userId: number;

    beforeAll(async () => {
        const userService = new UserService();
        const adminEmail = 'csvadmin@example.com';
        const adminPass = 'admin123';
        let admin = await userService.findByEmail(adminEmail);
        if (!admin) {
            admin = await userService.create({
                name: 'Admin CSV',
                email: adminEmail,
                password: adminPass,
                role: UserRole.Admin,
            });
        }
        userId = admin.id;

        const login = await request(server)
            .post('/api/login')
            .send({ email: adminEmail, password: adminPass })
            .expect(200);
        token = login.body.token;
    });

    it('imports a valid CSV and creates campaigns for the authenticated user', async () => {
        const res = await request(server)
            .post('/api/campaigns/import')
            .set('Authorization', `Bearer ${token}`)
            .send({ csv: VALID_CSV })
            .expect(201);

        expect(res.body).toMatchObject({
            message: '3 campaigns imported successfully.',
            count: 3,
        });
    });

    it('rejects CSV with wrong column headers', async () => {
        const res = await request(server)
            .post('/api/campaigns/import')
            .set('Authorization', `Bearer ${token}`)
            .send({ csv: WRONG_HEADER_CSV })
            .expect(422);

        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toContain('Invalid CSV format');
    });

    it('rejects CSV with empty data rows', async () => {
        const res = await request(server)
            .post('/api/campaigns/import')
            .set('Authorization', `Bearer ${token}`)
            .send({ csv: EMPTY_CSV })
            .expect(422);

        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toContain('empty');
    });

    it('rejects request without csv field', async () => {
        const res = await request(server)
            .post('/api/campaigns/import')
            .set('Authorization', `Bearer ${token}`)
            .send({})
            .expect(422);

        expect(res.body).toHaveProperty('message');
    });

    it('rejects request without authentication', async () => {
        await request(server)
            .post('/api/campaigns/import')
            .send({ csv: VALID_CSV })
            .expect(401);
    });

    it('creates platforms from CSV when they do not exist', async () => {
        const uniqueCsv = `campaign_id,campaign_name,spend,revenue,conversions,platform,company,start_date
X001,New Platform Test,1000.00,5000.00,50,UniquePlatformXYZ,TestCorp,2026-01-01
`;

        const res = await request(server)
            .post('/api/campaigns/import')
            .set('Authorization', `Bearer ${token}`)
            .send({ csv: uniqueCsv })
            .expect(201);

        expect(res.body.count).toBe(1);

        const platformsRes = await request(server)
            .get('/api/platforms')
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        const names = platformsRes.body.data.map((p: any) => p.name);
        expect(names).toContain('UniquePlatformXYZ');
    });

    it('binds imported campaigns to the authenticated user', async () => {
        const userSpecificCsv = `campaign_id,campaign_name,spend,revenue,conversions,platform,company,start_date
U001,UserSpecificTest,2000.00,8000.00,100,Facebook,TestCorp,2026-03-01
`;

        const importRes = await request(server)
            .post('/api/campaigns/import')
            .set('Authorization', `Bearer ${token}`)
            .send({ csv: userSpecificCsv })
            .expect(201);

        expect(importRes.body.count).toBe(1);

        const campaignsRes = await request(server)
            .get(`/api/campaigns?user_id=${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        const userCampaigns = campaignsRes.body.data.filter(
            (c: any) => c.name === 'UserSpecificTest'
        );
        expect(userCampaigns.length).toBe(1);
        expect(userCampaigns[0].user_id).toBe(userId);
    });
});
