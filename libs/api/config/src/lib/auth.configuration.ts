import { Inject } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import dotenvParseVariables from 'dotenv-parse-variables';

export type AuthConfigurationObject = {
  jwtSecret: string;
  jwtExpired: string;
  jwtSalt: number;
  signTokenSecret: string;
  xApiKey: string;
};

export const authConfiguration = registerAs<AuthConfigurationObject>(
  'auth',
  () => {
    const config = {
      jwtSecret: process.env.JWT_SECRET,
      jwtExpired: process.env.JWT_EXPIRED,
      jwtSalt: process.env.JWT_SALT,
      signTokenSecret: process.env.SIGN_TOKEN_SECRET,
      xApiKey: process.env.X_API_KEY,
    };
    return dotenvParseVariables(config) as AuthConfigurationObject;
  },
);

export const InjectAuthConfig = () => Inject(authConfiguration.KEY);
