import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterCampaignNameLength1748987400000 implements MigrationInterface {
    name = 'AlterCampaignNameLength1748987400000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE campaigns ALTER COLUMN name TYPE varchar(200)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE campaigns ALTER COLUMN name TYPE varchar(20)`);
    }
}
