import { CacheModule, Global, Module } from '@nestjs/common';
import ioRedisStore from 'cache-manager-ioredis';

import { CachingService } from './caching.service';

import { redisConfiguration } from '@everfit/api/config';
import { RedisConfig } from '@everfit/api/types';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      inject: [redisConfiguration.KEY],
      useFactory: (redisConfig: RedisConfig) => ({
        store: ioRedisStore,
        host: redisConfig.host,
        password: redisConfig.password,
        port: redisConfig.port,
        ttl: Number(redisConfig.ttl),
      }),
    }),
  ],
  providers: [CachingService],
  exports: [CachingService],
})
export class ApiCachingModule {}
