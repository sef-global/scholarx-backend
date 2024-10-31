import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class MenteeReminders1730362421047 implements MigrationInterface {
  name = 'MenteeReminders1730362421047'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "mentee_reminders" ("menteeId" uuid NOT NULL, "remindersSent" integer NOT NULL DEFAULT '0', "firstReminderSentAt" TIMESTAMP, "lastReminderSentAt" TIMESTAMP, "nextReminderDue" TIMESTAMP, "retryCount" integer NOT NULL DEFAULT '0', "nextRetryAt" TIMESTAMP, "lastErrorMessage" character varying(255), "isComplete" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_a2ae4434fe95f781453ed896f14" PRIMARY KEY ("menteeId"))`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_a2ae4434fe95f781453ed896f1" ON "mentee_reminders" ("menteeId") `
    )
    await queryRunner.query(`ALTER TABLE "mentor" ADD "countryUuid" uuid`)
    await queryRunner.query(
      `ALTER TABLE "mentee_reminder_configs" ALTER COLUMN "nextReminderDue" DROP NOT NULL`
    )
    await queryRunner.query(
      `ALTER TABLE "mentor" ADD CONSTRAINT "FK_3302c22eb1636f239d605eb61c3" FOREIGN KEY ("countryUuid") REFERENCES "country"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "mentee_reminders" ADD CONSTRAINT "FK_a2ae4434fe95f781453ed896f14" FOREIGN KEY ("menteeId") REFERENCES "mentee"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mentee_reminders" DROP CONSTRAINT "FK_a2ae4434fe95f781453ed896f14"`
    )
    await queryRunner.query(
      `ALTER TABLE "mentor" DROP CONSTRAINT "FK_3302c22eb1636f239d605eb61c3"`
    )
    await queryRunner.query(
      `ALTER TABLE "mentee_reminder_configs" ALTER COLUMN "nextReminderDue" SET NOT NULL`
    )
    await queryRunner.query(`ALTER TABLE "mentor" DROP COLUMN "countryUuid"`)
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a2ae4434fe95f781453ed896f1"`
    )
    await queryRunner.query(`DROP TABLE "mentee_reminders"`)
  }
}
