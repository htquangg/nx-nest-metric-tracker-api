import { Inject } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import dotenvParseVariables from 'dotenv-parse-variables';

export type RedisConfiguationObject = {
  isCacheEnabled: boolean;
  host: string;
  password: string;
  port: number;
  ttl: number;
};

export const redisConfiguration = registerAs<RedisConfiguationObject>(
  'redis',
  () => {
    const config = {
      isCacheEnabled: process.env.REDIS_CACHE_ENABLED,
      host: process.env.REDIS_HOST,
      password: process.env.REDIS_PASSWORD,
      port: process.env.REDIS_PORT,
      ttl: process.env.REDIS_TTL,
    };
    return dotenvParseVariables(config) as RedisConfiguationObject;
  },
);

export const InjectRedisConfig = () => Inject(redisConfiguration.KEY);
