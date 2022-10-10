import { Inject } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import dotenvParseVariables from 'dotenv-parse-variables';

export type AppConfigurationObject = {
  host: string;
  port: number;
  domain: string;
  env: string;
  clientDomain: string;
};

export const appConfiguration = registerAs<AppConfigurationObject>(
  'app',
  () => {
    const config = {
      host: process.env.APP_HOST,
      port: process.env.APP_PORT,
      domain: process.env.APP_DOMAIN,
      env: process.env.NODE_ENV,
      clientDomain: process.env.CLIENT_DOMAIN,
    };
    return dotenvParseVariables(config) as AppConfigurationObject;
  },
);

export const InjectAppConfig = () => Inject(appConfiguration.KEY);
