import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { LastVitalsLogCronJob } from './last-vitals-log.cronjob';

import { BodyVitalsModule, UserModule } from '@everfit/api/core';

@Module({
  imports: [ScheduleModule.forRoot(), UserModule, BodyVitalsModule],
  controllers: [],
  providers: [LastVitalsLogCronJob],
  exports: [],
})
export class BackgroundLastVitalsLogJobModule {}
