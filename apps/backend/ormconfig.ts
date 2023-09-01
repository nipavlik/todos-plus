import 'dotenv/config';
import { join } from 'path';
import { DataSource } from 'typeorm';

const myDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  logging: false,
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  migrations: ['migrations/**/*.{ts,js}'],
  migrationsTableName: 'migrations',
});

export default myDataSource;
