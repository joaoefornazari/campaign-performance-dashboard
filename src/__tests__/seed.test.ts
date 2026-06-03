import { describe, it, expect, beforeAll } from 'vitest';
import { api } from './setup.js';
import { AppDataSource } from '../database/data-source.js';
import { runSeed } from '../database/seeders/seed.js';
import { User } from '../entities/User.js';
import { Platform } from '../entities/Platform.js';
import { Campaign } from '../entities/Campaign.js';

describe('Database Seeder', () => {
  beforeAll(async () => {
    await runSeed();
  });

  it('should seed admin and standard users', async () => {
    const userRepo = AppDataSource.getRepository(User);

    const admin = await userRepo.findOne({ where: { email: 'admin@testmail.com' } });
    expect(admin).toBeDefined();
    expect(admin!.name).toBe('Admin User');
    expect(admin!.role).toBe('admin');

    const user = await userRepo.findOne({ where: { email: 'joao@testmail.com' } });
    expect(user).toBeDefined();
    expect(user!.name).toBe('João Silva');
    expect(user!.role).toBe('standard');
  });

  it('should seed platforms', async () => {
    const platformRepo = AppDataSource.getRepository(Platform);
    const platforms = await platformRepo.find();
    const names = platforms.map((p) => p.name);

    expect(names).toContain('Facebook');
    expect(names).toContain('Instagram');
    expect(names).toContain('Google');
    expect(names).toContain('TikTok');
  });

  it('should seed campaigns linked to users', async () => {
    const userRepo = AppDataSource.getRepository(User);
    const campaignRepo = AppDataSource.getRepository(Campaign);

    const admin = await userRepo.findOne({ where: { email: 'admin@testmail.com' } });
    const joao = await userRepo.findOne({ where: { email: 'joao@testmail.com' } });

    const adminCampaigns = await campaignRepo.find({ where: { user_id: admin!.id } });
    expect(adminCampaigns.length).toBe(3);
    expect(adminCampaigns.map((c) => c.name)).toContain('Wrinkle Cream — FB');
    expect(adminCampaigns.map((c) => c.name)).toContain('Weight Loss — IG');
    expect(adminCampaigns.map((c) => c.name)).toContain('Tirzepatide — FB Re');

    const joaoCampaigns = await campaignRepo.find({ where: { user_id: joao!.id } });
    expect(joaoCampaigns.length).toBe(2);
    expect(joaoCampaigns.map((c) => c.name)).toContain('Zepbound — Google');
    expect(joaoCampaigns.map((c) => c.name)).toContain('Collagen — TikTok');
  });

  it('should allow login with seeded credentials', async () => {
    const res = await api.post('/api/login').send({
      email: 'admin@testmail.com',
      password: 'password',
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.name).toBe('Admin User');
    expect(res.body.user.email).toBe('admin@testmail.com');
  });
});
