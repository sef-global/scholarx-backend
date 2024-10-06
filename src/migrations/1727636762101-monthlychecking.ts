import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class Monthlychecking1727636762101 implements MigrationInterface {
  name = 'Monthlychecking1727636762101'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "monthly-check-in" DROP COLUMN "tags"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "monthly-check-in" ADD "tags" json`)
  }
}
