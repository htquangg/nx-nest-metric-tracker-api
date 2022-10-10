import { Inject } from '@nestjs/common';
import { registerAs } from '@nestjs/config';

import dotenvParseVariables from 'dotenv-parse-variables';

export type ThrottlerConfigurationObject = {
  throttlerTtl: number;
  throttlerLimit: number;
};

export const throttlerConfiguration = registerAs<ThrottlerConfigurationObject>(
  'throttler',
  () => {
    const config = {
      throttlerTtl: process.env.THROTTLER_TTL,
      throttlerLimit: process.env.THROTTLER_LIMIT,
    };
    return dotenvParseVariables(config) as ThrottlerConfigurationObject;
  },
);

export const InjectThrottlerConfig = () => Inject(throttlerConfiguration.KEY);
