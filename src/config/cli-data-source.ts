import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  entities: ['src/**/*.entity.{js,ts}'],
  migrations: ['src/migrations/*{.js,.ts}'],
} as DataSourceOptions);
