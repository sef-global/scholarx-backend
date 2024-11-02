import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateMentorTableWithCountry1726930041488
  implements MigrationInterface
{
  name = 'UpdateMentorTableWithCountry1726930041488'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "mentor" ADD "countryUuid" uuid`)
    await queryRunner.query(
      `ALTER TABLE "mentor" ADD CONSTRAINT "FK_3302c22eb1636f239d605eb61c3" FOREIGN KEY ("countryUuid") REFERENCES "country"("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "mentor" DROP CONSTRAINT "FK_3302c22eb1636f239d605eb61c3"`
    )
    await queryRunner.query(`ALTER TABLE "mentor" DROP COLUMN "countryUuid"`)
  }
}
