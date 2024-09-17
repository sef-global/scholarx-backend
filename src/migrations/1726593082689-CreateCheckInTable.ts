import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class CreateCheckInTable1726593082689 implements MigrationInterface {
  name = 'CreateCheckInTable1726593082689'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "monthly_check_in" (
                "uuid" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "generalUpdatesAndFeedback" text NOT NULL,
                "progressTowardsGoals" text NOT NULL,
                "mediaContentLinks" json NOT NULL,
                "checkInDate" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "menteeId" uuid NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT "FK_monthly_check_in_mentee" FOREIGN KEY ("menteeId") REFERENCES "mentee"("uuid") ON DELETE CASCADE
            )
        `)

    // Add index on menteeId for better query performance
    await queryRunner.query(`
            CREATE INDEX "IDX_monthly_check_in_mentee" ON "monthly_check_in" ("menteeId")
        `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the index first
    await queryRunner.query(`
            DROP INDEX "IDX_monthly_check_in_mentee"
        `)

    // Then drop the table
    await queryRunner.query(`
            DROP TABLE "monthly_check_in"
        `)
  }
}
