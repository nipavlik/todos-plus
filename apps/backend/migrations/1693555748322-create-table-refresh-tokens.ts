import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableRefreshTokens1693555748322
  implements MigrationInterface
{
  name = 'CreateTableRefreshTokens1693555748322';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "refresh_tokens" (
        "id" SERIAL NOT NULL, 
        "user_id" integer NOT NULL, 
        "token" uuid NOT NULL, 
        "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
        
        CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "refresh_tokens_user_id_fkey"`,
    );
    await queryRunner.query(`DROP TABLE "refresh_tokens"`);
  }
}
