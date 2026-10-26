import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_DATABASE || 'postgres',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/**/migrations/*.js'],
  ssl: (() => {
    const nodeEnv = process.env.NODE_ENV;
    const dbSsl = process.env.DB_SSL;
    const dbHost = process.env.DB_HOST || '';

    if (dbSsl === 'true') return { rejectUnauthorized: false };
    if (dbSsl === 'false') return false;

    const isProdOrStaging = nodeEnv === 'production' || nodeEnv === 'staging';
    const isRds = dbHost.includes('rds.amazonaws.com');

    return isProdOrStaging || isRds ? { rejectUnauthorized: false } : false;
  })(),
});
