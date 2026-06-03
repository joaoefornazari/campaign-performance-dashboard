import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCompanyAndStockCache1748990000000 implements MigrationInterface {
    name = 'AddCompanyAndStockCache1748990000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE companies (
            id SERIAL PRIMARY KEY,
            name VARCHAR NOT NULL UNIQUE,
            ticker_symbol VARCHAR,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW(),
            deleted_at TIMESTAMP
        )`);

        await queryRunner.query(`CREATE TABLE company_user (
            id SERIAL PRIMARY KEY,
            company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT NOW()
        )`);

        await queryRunner.query(`CREATE TABLE stock_price_cache (
            id SERIAL PRIMARY KEY,
            ticker_symbol VARCHAR NOT NULL,
            price_date DATE NOT NULL,
            adjusted_close DOUBLE PRECISION NOT NULL,
            cached_at TIMESTAMP DEFAULT NOW()
        )`);

        await queryRunner.query(`CREATE UNIQUE INDEX idx_stock_cache_ticker_date ON stock_price_cache(ticker_symbol, price_date)`);

        await queryRunner.query(`ALTER TABLE campaigns ADD COLUMN company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL`);
        await queryRunner.query(`ALTER TABLE campaigns ADD COLUMN start_datetime TIMESTAMP`);
        await queryRunner.query(`UPDATE campaigns SET start_datetime = created_at WHERE start_datetime IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE campaigns DROP COLUMN start_datetime`);
        await queryRunner.query(`ALTER TABLE campaigns DROP COLUMN company_id`);
        await queryRunner.query(`DROP INDEX IF EXISTS idx_stock_cache_ticker_date`);
        await queryRunner.query(`DROP TABLE stock_price_cache`);
        await queryRunner.query(`DROP TABLE company_user`);
        await queryRunner.query(`DROP TABLE companies`);
    }
}
