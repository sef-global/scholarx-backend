import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class CreateCountryTable1726849469636 implements MigrationInterface {
  name = 'CreateCountryTable1726849469636'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "country" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_4e06beff3ecfb1a974312fe536d" PRIMARY KEY ("uuid"))`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "country"`)
  }
}
