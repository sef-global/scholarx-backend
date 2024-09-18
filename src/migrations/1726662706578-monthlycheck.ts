import { type MigrationInterface, type QueryRunner } from 'typeorm'

export class Monthlycheck1726662706578 implements MigrationInterface {
  name = 'Monthlycheck1726662706578'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if the table already exists
    const tableExists = await queryRunner.hasTable('monthly-check-in')
    if (!tableExists) {
      await queryRunner.query(`
        CREATE TABLE "monthly-check-in" (
          "uuid" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "created_at" TIMESTAMP NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
          "generalUpdatesAndFeedback" text NOT NULL,
          "progressTowardsGoals" text NOT NULL,
          "mediaContentLinks" json NOT NULL,
          "checkInDate" TIMESTAMP NOT NULL DEFAULT now(),
          "menteeId" uuid,
          CONSTRAINT "PK_44f1414b858e3eb6b8aacee7fbe" PRIMARY KEY ("uuid")
        )
      `)
      await queryRunner.query(`
        ALTER TABLE "monthly-check-in"
        ADD CONSTRAINT "FK_6de642444085d9599d3f260d566"
        FOREIGN KEY ("menteeId") REFERENCES "mentee"("uuid")
        ON DELETE NO ACTION ON UPDATE NO ACTION
      `)
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "monthly-check-in" DROP CONSTRAINT "FK_6de642444085d9599d3f260d566"
    `)
    await queryRunner.query(`
      DROP TABLE IF EXISTS "monthly-check-in"
    `)
  }
}
