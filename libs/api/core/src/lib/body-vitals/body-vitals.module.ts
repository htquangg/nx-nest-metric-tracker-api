import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { BodyVitalsService } from './body-vitals.service';
import { DistanceService } from './distance';
import { TemperatureService } from './temperature';
import { BodyVitalsNotifier } from './body-vitals.notifier';
import { BodyVitalsController } from './body-vitals.controller';
import { BodyVitalsDetailsService } from './body-vitals-details.service';
import { MeasurementUnitModule } from '../measurement-unit';
import { ExchangeRateModule } from '../exchange-rate';

import {
  BodyDistance,
  BodyTemperature,
  BodyVitalsLog,
  BodyVitalsDetailsLog,
} from '@everfit/api/entities';
import { ApiCachingModule } from '@everfit/api/services';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BodyVitalsLog,
      BodyVitalsDetailsLog,
      BodyDistance,
      BodyTemperature,
    ]),
    MeasurementUnitModule,
    ExchangeRateModule,
    ApiCachingModule,
    EventEmitterModule.forRoot({}),
  ],
  controllers: [BodyVitalsController],
  providers: [
    BodyVitalsService,
    DistanceService,
    TemperatureService,
    BodyVitalsDetailsService,
    BodyVitalsNotifier,
  ],
  exports: [BodyVitalsService, DistanceService, TemperatureService],
})
export class BodyVitalsModule {}
