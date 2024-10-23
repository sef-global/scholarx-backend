import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEmailRemainderConfig1729708532547 implements MigrationInterface {
    name = 'AddEmailRemainderConfig1729708532547'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "remainder_config" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "isEnable" boolean NOT NULL DEFAULT false, "remainderSchedule" character varying(100) NOT NULL DEFAULT '0 9 1 * *', "mentorshipDurationMonths" integer NOT NULL DEFAULT '6', CONSTRAINT "PK_c61c8742632cc9eab73c12f1ca0" PRIMARY KEY ("uuid"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "remainder_config"`);
    }

}
