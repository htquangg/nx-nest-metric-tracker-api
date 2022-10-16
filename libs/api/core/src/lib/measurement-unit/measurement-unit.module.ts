import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MeasurementUnitService } from './measurement-unit.service';

import { MeasurementUnit } from '@everfit/api/entities';

@Module({
  imports: [TypeOrmModule.forFeature([MeasurementUnit])],
  providers: [MeasurementUnitService],
  exports: [MeasurementUnitService],
})
export class MeasurementUnitModule {}
