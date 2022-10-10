import { BullModuleOptions } from '@nestjs/bull';
import { RedisConfig } from '@everfit/api/types';

export const queueDefaultOptions = {
  defaultJobOptions: {
    attempts: 5,
    timeout: 10000,
  },
};

export const queueProviderFactory =
  (name: string) =>
  (redisConfig: RedisConfig): BullModuleOptions => ({
    name,
    redis: {
      host: redisConfig.host,
      port: Number(redisConfig.port),
    },
    defaultJobOptions: queueDefaultOptions.defaultJobOptions,
  });

export const mailQueueName = 'mailQueue';

export const queueNames = [mailQueueName];
