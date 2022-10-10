import { ConfigType } from '@nestjs/config';

import {
  appConfiguration,
  authConfiguration,
  postgresConfiguration,
  redisConfiguration,
  mailConfiguration,
  throttlerConfiguration,
} from '@everfit/api/config';

export type AuthConfig = ConfigType<typeof authConfiguration>;
export type AppConfig = ConfigType<typeof appConfiguration>;
export type PostgresConfig = ConfigType<typeof postgresConfiguration>;
export type RedisConfig = ConfigType<typeof redisConfiguration>;
export type MailConfig = ConfigType<typeof mailConfiguration>;
export type ThrottlerConfig = ConfigType<typeof throttlerConfiguration>;
