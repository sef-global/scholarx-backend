import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class MonthlyCheckingTags1727197270336 implements MigrationInterface {
  name = 'MonthlyCheckingTags1727197270336'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "monthly-check-in" ADD "tags" json`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "monthly-check-in" DROP COLUMN "tags"`)
  }
}
