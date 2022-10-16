import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BodyVitalsService } from './body-vitals.service';
import { DistanceService } from './distance';
import { TemperatureService } from './temperature';
import { ExchangeRateModule } from '../exchange-rate';
import { MeasurementUnitModule } from '../measurement-unit';

import {
  BodyDistance,
  BodyTemperature,
  BodyVitalsLog,
} from '@everfit/api/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([BodyVitalsLog, BodyDistance, BodyTemperature]),
    MeasurementUnitModule,
    ExchangeRateModule,
  ],
  providers: [BodyVitalsService, DistanceService, TemperatureService],
  exports: [BodyVitalsService, DistanceService, TemperatureService],
})
export class BodyVitalsModule {}
