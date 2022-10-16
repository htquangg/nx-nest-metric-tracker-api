import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MeasurementUnitService } from './measurement-unit.service';

import { MeasurementUnit } from '@everfit/api/entities';
import { ApiCachingModule } from '@everfit/api/services';

@Module({
  imports: [TypeOrmModule.forFeature([MeasurementUnit]), ApiCachingModule],
  providers: [MeasurementUnitService],
  exports: [MeasurementUnitService],
})
export class MeasurementUnitModule {}
