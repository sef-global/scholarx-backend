import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class CreateCountryTable1726849469636 implements MigrationInterface {
  name = 'CreateCountryTable1726849469636'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "country" (
        "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "code" character varying NOT NULL,
        "name" character varying NOT NULL,
        CONSTRAINT "PK_4e06beff3ecfb1a974312fe536d" PRIMARY KEY ("uuid")
      )
    `)

    const columnExists = await queryRunner.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name='mentor' AND column_name='countryUuid'
    `)

    if (columnExists.length === 0) {
      await queryRunner.query(`ALTER TABLE "mentor" ADD "countryUuid" uuid`)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "mentor" DROP COLUMN "countryUuid"`)
    await queryRunner.query(`DROP TABLE "country"`)
  }
}
