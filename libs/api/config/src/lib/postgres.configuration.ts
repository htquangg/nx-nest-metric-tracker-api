import { Inject } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import dotenvParseVariables from 'dotenv-parse-variables';

export type PostgresConfiguationObject = {
  type: string;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
};

export const postgresConfiguration = registerAs<PostgresConfiguationObject>(
  'postgres',
  () => {
    const config = {
      type: 'postgres',
      host: process.env.POSTGRES_DB_HOST,
      port: process.env.POSTGRES_DB_PORT,
      database: process.env.POSTGRES_DB_DATABASE,
      username: process.env.POSTGRES_DB_USERNAME,
      password: process.env.POSTGRES_DB_PASSWORD,
    };
    return dotenvParseVariables(config) as PostgresConfiguationObject;
  },
);

export const InjectPostgresConfig = () => Inject(postgresConfiguration.KEY);
