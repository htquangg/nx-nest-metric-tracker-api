import { Module } from '@nestjs/common';

import { MeasurementController } from './measurement.controller';
import { MeasurementService } from './measurement.service';
import { BodyVitalsModule } from '../body-vitals';

@Module({
  imports: [BodyVitalsModule],
  controllers: [MeasurementController],
  providers: [MeasurementService],
  exports: [MeasurementService],
})
export class MeasurementModule {}
