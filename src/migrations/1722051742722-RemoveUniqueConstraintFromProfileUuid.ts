import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class RemoveUniqueConstraintFromProfileUuid1722051742722
  implements MigrationInterface
{
  name = 'RemoveUniqueConstraintFromProfileUuid1722051742722'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if the constraint exists before attempting to drop it
    const constraintExists = await queryRunner.query(`
      SELECT 1
      FROM information_schema.table_constraints
      WHERE constraint_name = 'REL_f671cf2220d1bd0621a1a5e92e'
        AND table_name = 'mentee'
    `)

    if (constraintExists.length > 0) {
      await queryRunner.query(
        `ALTER TABLE "mentee" DROP CONSTRAINT "REL_f671cf2220d1bd0621a1a5e92e"`
      )
    }

    await queryRunner.query(
      `ALTER TABLE "mentee" DROP CONSTRAINT "FK_f671cf2220d1bd0621a1a5e92e7"`
    )
    await queryRunner.query(
      `ALTER TABLE "mentee" ADD CONSTRAINT "FK_f671cf2220d1bd0621a1a5e92e7" FOREIGN KEY ("profileUuid") REFERENCES "profile"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mentee" DROP CONSTRAINT "FK_f671cf2220d1bd0621a1a5e92e7"`
    )
    await queryRunner.query(
      `ALTER TABLE "mentee" ADD CONSTRAINT "REL_f671cf2220d1bd0621a1a5e92e" UNIQUE ("profileUuid")`
    )
    await queryRunner.query(
      `ALTER TABLE "mentee" ADD CONSTRAINT "FK_f671cf2220d1bd0621a1a5e92e7" FOREIGN KEY ("profileUuid") REFERENCES "profile"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
