import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { BodyVitalsModule, UserModule } from '@everfit/api/core';

@Module({
  imports: [ScheduleModule.forRoot(), UserModule, BodyVitalsModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class BackgroundLastVitalsLogJobModule {}
