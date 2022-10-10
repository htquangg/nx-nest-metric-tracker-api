import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { appConfiguration } from './app.configuration';
import { authConfiguration } from './auth.configuration';
import { postgresConfiguration } from './postgres.configuration';
import { redisConfiguration } from './redis.configuration';
import { mailConfiguration } from './mail.configuration';
import { throttlerConfiguration } from './throttler.configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: false,
      envFilePath: ['.env.local', '.env', '.env.prod'],
      load: [
        appConfiguration,
        authConfiguration,
        postgresConfiguration,
        redisConfiguration,
        mailConfiguration,
        throttlerConfiguration,
      ],
    }),
  ],
})
export class ApiConfigModule {}
