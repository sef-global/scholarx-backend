import { MigrationInterface, QueryRunner } from "typeorm";

export class MonthlyCheckingRename1733854881851 implements MigrationInterface {
    name = 'MonthlyCheckingRename1733854881851'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "monthly-check-in" RENAME COLUMN "title" TO "month"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "monthly-check-in" RENAME COLUMN "month" TO "title"`);
    }

}
