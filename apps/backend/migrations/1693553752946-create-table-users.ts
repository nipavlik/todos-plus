import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableUsers1693553752946 implements MigrationInterface {
  name = 'CreateTableUsers1693553752946';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" (
        "id" SERIAL NOT NULL, 
        "first_name" character varying(255) NOT NULL, 
        "last_name" character varying(255) NOT NULL, 
        "username" character varying(255) NOT NULL,
        "password" character varying(255) NOT NULL, 
        "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
         
        CONSTRAINT "users_username_key" UNIQUE ("username"), 
        CONSTRAINT "users_pkey" PRIMARY KEY ("id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
