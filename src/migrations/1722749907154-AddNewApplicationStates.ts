import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class AddNewApplicationStates1722749907154
  implements MigrationInterface
{
  name = 'AddNewApplicationStates1722749907154'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "public"."mentee_state_enum" RENAME TO "mentee_state_enum_old"`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."mentee_state_enum" AS ENUM('pending', 'rejected', 'approved', 'completed', 'revoked')`
    )
    await queryRunner.query(
      `ALTER TABLE "mentee" ALTER COLUMN "state" DROP DEFAULT`
    )
    await queryRunner.query(
      `ALTER TABLE "mentee" ALTER COLUMN "state" TYPE "public"."mentee_state_enum" USING "state"::"text"::"public"."mentee_state_enum"`
    )
    await queryRunner.query(
      `ALTER TABLE "mentee" ALTER COLUMN "state" SET DEFAULT 'pending'`
    )
    await queryRunner.query(`DROP TYPE "public"."mentee_state_enum_old"`)
    await queryRunner.query(`ALTER TABLE "mentee" DROP COLUMN "certificate_id"`)
    await queryRunner.query(`ALTER TABLE "mentee" ADD "certificate_id" uuid`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "mentee" DROP COLUMN "certificate_id"`)
    await queryRunner.query(`ALTER TABLE "mentee" ADD "certificate_id" bigint`)
    await queryRunner.query(
      `CREATE TYPE "public"."mentee_state_enum_old" AS ENUM('pending', 'rejected', 'approved')`
    )
    await queryRunner.query(
      `ALTER TABLE "mentee" ALTER COLUMN "state" DROP DEFAULT`
    )
    await queryRunner.query(
      `ALTER TABLE "mentee" ALTER COLUMN "state" TYPE "public"."mentee_state_enum_old" USING "state"::"text"::"public"."mentee_state_enum_old"`
    )
    await queryRunner.query(
      `ALTER TABLE "mentee" ALTER COLUMN "state" SET DEFAULT 'pending'`
    )
    await queryRunner.query(`DROP TYPE "public"."mentee_state_enum"`)
    await queryRunner.query(
      `ALTER TYPE "public"."mentee_state_enum_old" RENAME TO "mentee_state_enum"`
    )
  }
}
