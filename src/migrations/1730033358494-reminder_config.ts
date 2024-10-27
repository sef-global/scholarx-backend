import { MigrationInterface, QueryRunner } from "typeorm";

export class ReminderConfig1730033358494 implements MigrationInterface {
    name = 'ReminderConfig1730033358494'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reminder_attempts" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "menteeId" uuid NOT NULL, "status" "public"."reminder_attempts_status_enum" NOT NULL DEFAULT 'pending', "sequence" integer NOT NULL, "retryCount" integer NOT NULL DEFAULT '0', "processedAt" TIMESTAMP, "nextRetryAt" TIMESTAMP NOT NULL, "errorMessage" text, CONSTRAINT "PK_c5ba5d688c6a78a67c786f5cb2b" PRIMARY KEY ("uuid"))`);
        await queryRunner.query(`CREATE TABLE "mentee_reminder_configs" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "menteeId" uuid NOT NULL, "email" character varying(255) NOT NULL, "firstName" character varying(255) NOT NULL, "firstReminderSentAt" TIMESTAMP, "currentSequence" integer NOT NULL DEFAULT '0', "lastReminderSentAt" TIMESTAMP, "nextReminderDue" TIMESTAMP NOT NULL, "isComplete" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_ce2ebbc0fd11a8e0e1c35f06108" PRIMARY KEY ("uuid", "menteeId"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_19e37bcbcb83cf968be2ffe4e6" ON "mentee_reminder_configs" ("menteeId") `);
        await queryRunner.query(`ALTER TABLE "reminder_attempts" ADD CONSTRAINT "FK_5d0f136c64e679dd74878f496c6" FOREIGN KEY ("menteeId") REFERENCES "mentee_reminder_configs"("menteeId") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "mentee_reminder_configs" ADD CONSTRAINT "FK_19e37bcbcb83cf968be2ffe4e69" FOREIGN KEY ("menteeId") REFERENCES "mentee"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "mentee_reminder_configs" DROP CONSTRAINT "FK_19e37bcbcb83cf968be2ffe4e69"`);
        await queryRunner.query(`ALTER TABLE "reminder_attempts" DROP CONSTRAINT "FK_5d0f136c64e679dd74878f496c6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_19e37bcbcb83cf968be2ffe4e6"`);
        await queryRunner.query(`DROP TABLE "mentee_reminder_configs"`);
        await queryRunner.query(`DROP TABLE "reminder_attempts"`);
    }

}
