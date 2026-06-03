import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { UserRole } from '../../enums/UserRole.js';
import { User } from '../../entities/User.js';
import { Platform } from '../../entities/Platform.js';
import { Campaign } from '../../entities/Campaign.js';
import { PersonalAccessToken } from '../../entities/PersonalAccessToken.js';
import { AppDataSource } from '../data-source.js';

export async function runSeed(ds?: DataSource): Promise<void> {
  const dataSource = ds || AppDataSource;

  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  const userRepo = dataSource.getRepository(User);
  const platformRepo = dataSource.getRepository(Platform);
  const campaignRepo = dataSource.getRepository(Campaign);

  let admin = await userRepo.findOne({ where: { email: 'admin@testmail.com' } });
  if (!admin) {
    const hashed = await bcrypt.hash('password', 10);
    admin = userRepo.create({
      name: 'Admin User',
      email: 'admin@testmail.com',
      password: hashed,
      role: UserRole.Admin,
    });
    admin = await userRepo.save(admin);
  }

  let user = await userRepo.findOne({ where: { email: 'joao@testmail.com' } });
  if (!user) {
    const hashed = await bcrypt.hash('password', 10);
    user = userRepo.create({
      name: 'João Silva',
      email: 'joao@testmail.com',
      password: hashed,
      role: UserRole.Standard,
    });
    user = await userRepo.save(user);
  }

  const platformNames = ['Facebook', 'Instagram', 'Google', 'TikTok'];
  const platforms: { id: number; name: string }[] = [];

  for (const name of platformNames) {
    let platform = await platformRepo.findOne({ where: { name } });
    if (!platform) {
      platform = platformRepo.create({ name });
      platform = await platformRepo.save(platform);
    }
    platforms.push({ id: platform.id, name: platform.name });
  }

  const getPlatformId = (name: string) => platforms.find((p) => p.name === name)!.id;

  const seedCampaigns = [
    { name: 'Wrinkle Cream — FB', spend: 4200.0, revenue: 18900.0, conversions: 312, platform: 'Facebook', user_id: admin.id },
    { name: 'Weight Loss — IG', spend: 3100.5, revenue: 8680.0, conversions: 198, platform: 'Instagram', user_id: admin.id },
    { name: 'Tirzepatide — FB Re', spend: 1800.0, revenue: 9540.0, conversions: 156, platform: 'Facebook', user_id: admin.id },
    { name: 'Zepbound — Google', spend: 5500.0, revenue: 24750.0, conversions: 440, platform: 'Google', user_id: user.id },
    { name: 'Collagen — TikTok', spend: 2200.0, revenue: 4840.0, conversions: 87, platform: 'TikTok', user_id: user.id },
  ];

  for (const c of seedCampaigns) {
    const existing = await campaignRepo.findOne({ where: { name: c.name, user_id: c.user_id } });
    if (!existing) {
      await campaignRepo.save(campaignRepo.create({
        name: c.name,
        spend: c.spend,
        revenue: c.revenue,
        conversions: c.conversions,
        platform_id: getPlatformId(c.platform),
        user_id: c.user_id,
      }));
    }
  }
}

const __filename = fileURLToPath(import.meta.url);
const isMain = process.argv[1] && (
  process.argv[1] === __filename || process.argv[1].replace(/\\/g, '/') === __filename.replace(/\\/g, '/')
);

if (isMain) {
  if (process.env.NODE_ENV === 'production') {
    console.error('Seeder cannot run in production.');
    process.exit(1);
  }

  dotenv.config();

  const dbDatabase = process.env.DB_DATABASE || 'skyhouse';

  const seedDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || '/var/run/postgresql',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'joaoe',
    password: process.env.DB_PASSWORD || '',
    database: dbDatabase,
    synchronize: true,
    dropSchema: true,
    logging: false,
    entities: [User, Platform, Campaign, PersonalAccessToken],
    migrations: [],
    subscribers: [],
  });

  try {
    await runSeed(seedDataSource);
    console.log('Database seeded successfully.');
  } catch (err) {
    console.error('Seed failed:', err instanceof Error ? err.message : err);
    process.exit(1);
  } finally {
    if (seedDataSource.isInitialized) {
      await seedDataSource.destroy();
    }
  }
}
