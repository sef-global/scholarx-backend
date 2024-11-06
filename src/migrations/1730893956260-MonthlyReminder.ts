import { MigrationInterface, QueryRunner } from "typeorm";

export class MonthlyReminder1730893956260 implements MigrationInterface {
    name = 'MonthlyReminder1730893956260'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "monthly_reminders" RENAME COLUMN "sentAt" TO "nextReminderDate"`);
        await queryRunner.query(`ALTER TABLE "mentee" DROP COLUMN "last_monthlycheck_send_at"`);
        await queryRunner.query(`ALTER TYPE "public"."monthly_reminders_status_enum" RENAME TO "monthly_reminders_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."monthly_reminders_status_enum" AS ENUM('pending', 'sending', 'completed', 'failed', 'sent', 'scheduled')`);
        await queryRunner.query(`ALTER TABLE "monthly_reminders" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "monthly_reminders" ALTER COLUMN "status" TYPE "public"."monthly_reminders_status_enum" USING "status"::"text"::"public"."monthly_reminders_status_enum"`);
        await queryRunner.query(`ALTER TABLE "monthly_reminders" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."monthly_reminders_status_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."reminder_attempts_status_enum" RENAME TO "reminder_attempts_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."reminder_attempts_status_enum" AS ENUM('pending', 'sending', 'completed', 'failed', 'sent', 'scheduled')`);
        await queryRunner.query(`DROP TYPE "public"."reminder_attempts_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."reminder_attempts_status_enum" AS ENUM('pending', 'sending', 'completed', 'failed', 'sent', 'scheduled')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."monthly_reminders_status_enum_old" AS ENUM('pending', 'sending', 'completed', 'failed', 'done', 'scheduled', 'sent', 'waiting', 'processing')`);
        await queryRunner.query(`ALTER TABLE "monthly_reminders" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "monthly_reminders" ALTER COLUMN "status" TYPE "public"."monthly_reminders_status_enum_old" USING "status"::"text"::"public"."monthly_reminders_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "monthly_reminders" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."monthly_reminders_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."monthly_reminders_status_enum_old" RENAME TO "monthly_reminders_status_enum"`);
        await queryRunner.query(`ALTER TABLE "mentee" ADD "last_monthlycheck_send_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "monthly_reminders" RENAME COLUMN "nextReminderDate" TO "sentAt"`);
    }

}
