import {
  BodyDistance,
  BodyTemperature,
  BodyVitalsLog,
} from '@everfit/api/entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BodyVitalsService } from './body-vitals.service';
import { DistanceService } from './distance';
import { TemperatureService } from './temperature';

@Module({
  imports: [
    TypeOrmModule.forFeature([BodyVitalsLog, BodyDistance, BodyTemperature]),
  ],
  providers: [BodyVitalsService, DistanceService, TemperatureService],
  exports: [BodyVitalsService, DistanceService, TemperatureService],
})
export class BodyVitalsModule {}
