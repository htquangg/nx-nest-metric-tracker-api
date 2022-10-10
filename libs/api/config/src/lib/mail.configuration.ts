import { Inject } from '@nestjs/common';
import { registerAs } from '@nestjs/config';

import dotenvParseVariables from 'dotenv-parse-variables';

export type MailConfigurationObject = {
  awsSESRegion: string;
  awsSESAccessKeyId: string;
  awsSESSecretAccessKey: string;
  awsSESFromAddress: string;
  awsSESApiVersion: string;
};

export const mailConfiguration = registerAs<MailConfigurationObject>(
  'mail',
  () => {
    const config = {
      awsSESRegion: process.env.AWS_SES_REGION,
      awsSESAccessKeyId: process.env.AWS_SES_ACCESS_KEY_ID,
      awsSESSecretAccessKey: process.env.AWS_SES_SECRET_ACCESS_KEY,
      awsSESFromAddress: process.env.AWS_SES_FROM_ADDRESS,
      awsSESApiVersion: process.env.AWS_SES_API_VERSION,
    };
    return dotenvParseVariables(config) as MailConfigurationObject;
  },
);

export const InjectMailConfig = () => Inject(mailConfiguration.KEY);
