import { MigrationInterface, QueryRunner } from "typeorm";

export class ProfileLastNameNullable1720590807560 implements MigrationInterface {
    name = 'ProfileLastNameNullable1720590807560'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "last_name" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "profile" ALTER COLUMN "last_name" SET NOT NULL`);
    }

}
