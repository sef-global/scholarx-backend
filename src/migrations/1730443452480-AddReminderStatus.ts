import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class AddReminderStatus1730443452480 implements MigrationInterface {
  name = 'AddReminderStatus1730443452480'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."mentee_reminders_status_enum" AS ENUM('pending', 'sending', 'complete', 'failed', 'done', 'scheduled', 'sent')`
    )
    await queryRunner.query(
      `ALTER TABLE "mentee_reminders" ADD "status" "public"."mentee_reminders_status_enum" NOT NULL DEFAULT 'pending'`
    )
    await queryRunner.query(
      `ALTER TYPE "public"."email_reminders_status_enum" RENAME TO "email_reminders_status_enum_old"`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."email_reminders_status_enum" AS ENUM('pending', 'sending', 'complete', 'failed', 'done', 'scheduled', 'sent')`
    )
    await queryRunner.query(
      `ALTER TABLE "email_reminders" ALTER COLUMN "status" DROP DEFAULT`
    )
    await queryRunner.query(
      `ALTER TABLE "email_reminders" ALTER COLUMN "status" TYPE "public"."email_reminders_status_enum" USING "status"::"text"::"public"."email_reminders_status_enum"`
    )
    await queryRunner.query(
      `ALTER TABLE "email_reminders" ALTER COLUMN "status" SET DEFAULT 'pending'`
    )
    await queryRunner.query(
      `DROP TYPE "public"."email_reminders_status_enum_old"`
    )
    await queryRunner.query(
      `ALTER TYPE "public"."reminder_attempts_status_enum" RENAME TO "reminder_attempts_status_enum_old"`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."reminder_attempts_status_enum" AS ENUM('pending', 'sending', 'complete', 'failed', 'done', 'scheduled', 'sent')`
    )
    await queryRunner.query(
      `ALTER TABLE "reminder_attempts" ALTER COLUMN "status" DROP DEFAULT`
    )
    await queryRunner.query(
      `ALTER TABLE "reminder_attempts" ALTER COLUMN "status" TYPE "public"."reminder_attempts_status_enum" USING "status"::"text"::"public"."reminder_attempts_status_enum"`
    )
    await queryRunner.query(
      `ALTER TABLE "reminder_attempts" ALTER COLUMN "status" SET DEFAULT 'pending'`
    )
    await queryRunner.query(
      `DROP TYPE "public"."reminder_attempts_status_enum_old"`
    )
    await queryRunner.query(
      `ALTER TABLE "mentee_reminder_configs" ALTER COLUMN "nextReminderDue" SET NOT NULL`
    )
    await queryRunner.query(
      `ALTER TYPE "public"."reminder_attempts_status_enum" RENAME TO "reminder_attempts_status_enum_old"`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."reminder_attempts_status_enum" AS ENUM('pending', 'sending', 'complete', 'failed', 'done', 'scheduled', 'sent')`
    )
    await queryRunner.query(
      `ALTER TABLE "reminder_attempts" ALTER COLUMN "status" DROP DEFAULT`
    )
    await queryRunner.query(
      `ALTER TABLE "reminder_attempts" ALTER COLUMN "status" TYPE "public"."reminder_attempts_status_enum" USING "status"::"text"::"public"."reminder_attempts_status_enum"`
    )
    await queryRunner.query(
      `ALTER TABLE "reminder_attempts" ALTER COLUMN "status" SET DEFAULT 'pending'`
    )
    await queryRunner.query(
      `DROP TYPE "public"."reminder_attempts_status_enum_old"`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."reminder_attempts_status_enum_old" AS ENUM('pending', 'processing', 'complete', 'failed', 'done')`
    )
    await queryRunner.query(
      `ALTER TABLE "reminder_attempts" ALTER COLUMN "status" DROP DEFAULT`
    )
    await queryRunner.query(
      `ALTER TABLE "reminder_attempts" ALTER COLUMN "status" TYPE "public"."reminder_attempts_status_enum_old" USING "status"::"text"::"public"."reminder_attempts_status_enum_old"`
    )
    await queryRunner.query(
      `ALTER TABLE "reminder_attempts" ALTER COLUMN "status" SET DEFAULT 'pending'`
    )
    await queryRunner.query(
      `DROP TYPE "public"."reminder_attempts_status_enum"`
    )
    await queryRunner.query(
      `ALTER TYPE "public"."reminder_attempts_status_enum_old" RENAME TO "reminder_attempts_status_enum"`
    )
    await queryRunner.query(
      `ALTER TABLE "mentee_reminder_configs" ALTER COLUMN "nextReminderDue" DROP NOT NULL`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."reminder_attempts_status_enum_old" AS ENUM('pending', 'processing', 'complete', 'failed', 'done')`
    )
    await queryRunner.query(
      `ALTER TABLE "reminder_attempts" ALTER COLUMN "status" DROP DEFAULT`
    )
    await queryRunner.query(
      `ALTER TABLE "reminder_attempts" ALTER COLUMN "status" TYPE "public"."reminder_attempts_status_enum_old" USING "status"::"text"::"public"."reminder_attempts_status_enum_old"`
    )
    await queryRunner.query(
      `ALTER TABLE "reminder_attempts" ALTER COLUMN "status" SET DEFAULT 'pending'`
    )
    await queryRunner.query(
      `DROP TYPE "public"."reminder_attempts_status_enum"`
    )
    await queryRunner.query(
      `ALTER TYPE "public"."reminder_attempts_status_enum_old" RENAME TO "reminder_attempts_status_enum"`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."email_reminders_status_enum_old" AS ENUM('pending', 'processing', 'complete', 'failed', 'done')`
    )
    await queryRunner.query(
      `ALTER TABLE "email_reminders" ALTER COLUMN "status" DROP DEFAULT`
    )
    await queryRunner.query(
      `ALTER TABLE "email_reminders" ALTER COLUMN "status" TYPE "public"."email_reminders_status_enum_old" USING "status"::"text"::"public"."email_reminders_status_enum_old"`
    )
    await queryRunner.query(
      `ALTER TABLE "email_reminders" ALTER COLUMN "status" SET DEFAULT 'pending'`
    )
    await queryRunner.query(`DROP TYPE "public"."email_reminders_status_enum"`)
    await queryRunner.query(
      `ALTER TYPE "public"."email_reminders_status_enum_old" RENAME TO "email_reminders_status_enum"`
    )
    await queryRunner.query(
      `ALTER TABLE "mentee_reminders" DROP COLUMN "status"`
    )
    await queryRunner.query(`DROP TYPE "public"."mentee_reminders_status_enum"`)
  }
}
