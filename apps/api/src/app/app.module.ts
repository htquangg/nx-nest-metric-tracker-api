import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';

import { BackgroundModule } from './background.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { Entities } from '@everfit/api/entities';
import {
  ApiConfigModule,
  postgresConfiguration,
  throttlerConfiguration,
} from '@everfit/api/config';
import { ApiCommonModule, EverfitThrottlerGuard } from '@everfit/api/common';
import { ApiCoreModule } from '@everfit/api/core';
import { ApiServicesModule } from '@everfit/api/services';
import type { PostgresConfig, ThrottlerConfig } from '@everfit/api/types';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ApiConfigModule,
    ThrottlerModule.forRootAsync({
      inject: [throttlerConfiguration.KEY],
      useFactory: (throttlerConfig: ThrottlerConfig) => ({
        ttl: throttlerConfig.throttlerTtl,
        limit: throttlerConfig.throttlerLimit,
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [postgresConfiguration.KEY],
      useFactory: (postgresConfig: PostgresConfig) => ({
        ...postgresConfig,
        type: 'postgres',
        autoLoadEntities: true,
        entities: Entities,
        synchronize: true,
      }),
    }),
    BackgroundModule,
    ApiServicesModule,
    ApiCommonModule,
    ApiCoreModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: EverfitThrottlerGuard,
    },
  ],
})
export class AppModule {}
