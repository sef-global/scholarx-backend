import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class Reminders1733219895951 implements MigrationInterface {
  name = 'Reminders1733219895951'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "monthly-check-in" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" text NOT NULL, "generalUpdatesAndFeedback" text NOT NULL, "progressTowardsGoals" text NOT NULL, "mediaContentLinks" json, "mentorFeedback" text, "isCheckedByMentor" boolean NOT NULL DEFAULT false, "mentorCheckedDate" TIMESTAMP, "checkInDate" TIMESTAMP NOT NULL DEFAULT now(), "menteeId" uuid, CONSTRAINT "PK_44f1414b858e3eb6b8aacee7fbe" PRIMARY KEY ("uuid"))`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."monthly_reminders_status_enum" AS ENUM('pending', 'sent', 'failed', 'scheduled', 'completed', 'sending')`
    )
    await queryRunner.query(
      `CREATE TABLE "monthly_reminders" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."monthly_reminders_status_enum" NOT NULL DEFAULT 'pending', "lastError" text, "remindersSent" integer NOT NULL DEFAULT '0', "nextReminderDate" TIMESTAMP, "lastSentDate" TIMESTAMP, "menteeUuid" uuid, CONSTRAINT "PK_f3b22313af4df0cb9cf9c41c681" PRIMARY KEY ("uuid"))`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."mentee_state_enum" AS ENUM('pending', 'rejected', 'approved', 'completed', 'revoked')`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."mentee_status_updated_by_enum" AS ENUM('admin', 'mentor')`
    )
    await queryRunner.query(
      `CREATE TABLE "mentee" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "state" "public"."mentee_state_enum" NOT NULL DEFAULT 'pending', "status_updated_by" "public"."mentee_status_updated_by_enum", "status_updated_date" TIMESTAMP, "application" json NOT NULL, "certificate_id" uuid, "journal" character varying, "profileUuid" uuid, "mentorUuid" uuid, CONSTRAINT "PK_694f9d45c4a2a5bd2e4158df6a8" PRIMARY KEY ("uuid"))`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."profile_type_enum" AS ENUM('default', 'admin')`
    )
    await queryRunner.query(
      `CREATE TABLE "profile" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "primary_email" character varying(255) NOT NULL, "first_name" character varying(255) NOT NULL, "last_name" character varying(255), "image_url" character varying(255) NOT NULL, "type" "public"."profile_type_enum" NOT NULL DEFAULT 'default', "password" character varying(255) NOT NULL, CONSTRAINT "UQ_def641b0892f8d810007e362eb0" UNIQUE ("primary_email"), CONSTRAINT "PK_fab5f83a1cc8ebe0076c733fd85" PRIMARY KEY ("uuid"))`
    )
    await queryRunner.query(
      `CREATE TABLE "country" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "code" character varying NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_4e06beff3ecfb1a974312fe536d" PRIMARY KEY ("uuid"))`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."mentor_state_enum" AS ENUM('pending', 'rejected', 'approved')`
    )
    await queryRunner.query(
      `CREATE TABLE "mentor" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "state" "public"."mentor_state_enum" NOT NULL DEFAULT 'pending', "application" json NOT NULL, "availability" boolean NOT NULL, "categoryUuid" uuid, "profileUuid" uuid, "countryUuid" uuid, CONSTRAINT "PK_50288edf84756228c143608b2be" PRIMARY KEY ("uuid"))`
    )
    await queryRunner.query(
      `CREATE TABLE "category" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "category" character varying(255) NOT NULL, CONSTRAINT "PK_86ee096735ccbfa3fd319af1833" PRIMARY KEY ("uuid"))`
    )
    await queryRunner.query(
      `CREATE TYPE "public"."email_state_enum" AS ENUM('sent', 'delivered', 'failed')`
    )
    await queryRunner.query(
      `CREATE TABLE "email" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "recipient" character varying(255) NOT NULL, "subject" character varying(255) NOT NULL, "content" character varying NOT NULL, "state" "public"."email_state_enum" NOT NULL, CONSTRAINT "PK_a6db4f191b9a83ca3c8f4149d13" PRIMARY KEY ("uuid"))`
    )
    await queryRunner.query(
      `ALTER TABLE "monthly-check-in" ADD CONSTRAINT "FK_6de642444085d9599d3f260d566" FOREIGN KEY ("menteeId") REFERENCES "mentee"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "monthly_reminders" ADD CONSTRAINT "FK_3c019691242e748da81b48747ff" FOREIGN KEY ("menteeUuid") REFERENCES "mentee"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "mentee" ADD CONSTRAINT "FK_f671cf2220d1bd0621a1a5e92e7" FOREIGN KEY ("profileUuid") REFERENCES "profile"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "mentee" ADD CONSTRAINT "FK_1fd04826f894fd63a0ce080f6e4" FOREIGN KEY ("mentorUuid") REFERENCES "mentor"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "mentor" ADD CONSTRAINT "FK_59a1e655aa15be5f068a11f0d23" FOREIGN KEY ("categoryUuid") REFERENCES "category"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "mentor" ADD CONSTRAINT "FK_ee49a3436192915d20e07378f16" FOREIGN KEY ("profileUuid") REFERENCES "profile"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "mentor" ADD CONSTRAINT "FK_3302c22eb1636f239d605eb61c3" FOREIGN KEY ("countryUuid") REFERENCES "country"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mentor" DROP CONSTRAINT "FK_3302c22eb1636f239d605eb61c3"`
    )
    await queryRunner.query(
      `ALTER TABLE "mentor" DROP CONSTRAINT "FK_ee49a3436192915d20e07378f16"`
    )
    await queryRunner.query(
      `ALTER TABLE "mentor" DROP CONSTRAINT "FK_59a1e655aa15be5f068a11f0d23"`
    )
    await queryRunner.query(
      `ALTER TABLE "mentee" DROP CONSTRAINT "FK_1fd04826f894fd63a0ce080f6e4"`
    )
    await queryRunner.query(
      `ALTER TABLE "mentee" DROP CONSTRAINT "FK_f671cf2220d1bd0621a1a5e92e7"`
    )
    await queryRunner.query(
      `ALTER TABLE "monthly_reminders" DROP CONSTRAINT "FK_3c019691242e748da81b48747ff"`
    )
    await queryRunner.query(
      `ALTER TABLE "monthly-check-in" DROP CONSTRAINT "FK_6de642444085d9599d3f260d566"`
    )
    await queryRunner.query(`DROP TABLE "email"`)
    await queryRunner.query(`DROP TYPE "public"."email_state_enum"`)
    await queryRunner.query(`DROP TABLE "category"`)
    await queryRunner.query(`DROP TABLE "mentor"`)
    await queryRunner.query(`DROP TYPE "public"."mentor_state_enum"`)
    await queryRunner.query(`DROP TABLE "country"`)
    await queryRunner.query(`DROP TABLE "profile"`)
    await queryRunner.query(`DROP TYPE "public"."profile_type_enum"`)
    await queryRunner.query(`DROP TABLE "mentee"`)
    await queryRunner.query(
      `DROP TYPE "public"."mentee_status_updated_by_enum"`
    )
    await queryRunner.query(`DROP TYPE "public"."mentee_state_enum"`)
    await queryRunner.query(`DROP TABLE "monthly_reminders"`)
    await queryRunner.query(
      `DROP TYPE "public"."monthly_reminders_status_enum"`
    )
    await queryRunner.query(`DROP TABLE "monthly-check-in"`)
  }
}
