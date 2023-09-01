import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableTodos1693555141837 implements MigrationInterface {
  name = 'CreateTableTodos1693555141837';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "todos" (
        "id" SERIAL NOT NULL, 
        "title" character varying(255) NOT NULL, 
        "content" character varying(4096) NOT NULL, 
        "done" boolean NOT NULL DEFAULT false, 
        "user_id" integer NOT NULL, 
        "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
        
        CONSTRAINT "todos_pkey" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `ALTER TABLE "todos" ADD CONSTRAINT "todos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "todos" DROP CONSTRAINT "todos_user_id_fkey"`,
    );
    await queryRunner.query(`DROP TABLE "todos"`);
  }
}
