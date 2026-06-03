import 'reflect-metadata';
import { AppDataSource } from '../data-source.js';

async function runMigrations() {
    const dataSource = await AppDataSource.initialize();
    await dataSource.runMigrations();
    await dataSource.destroy();
    console.log('Migrations ran successfully.');
}

runMigrations().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
