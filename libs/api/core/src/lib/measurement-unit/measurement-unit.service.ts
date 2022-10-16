import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MeasurementUnit } from '@everfit/api/entities';
import { EverfitBaseService } from '@everfit/api/common';

@Injectable()
export class MeasurementUnitService extends EverfitBaseService<MeasurementUnit> {
  constructor(
    @InjectRepository(MeasurementUnit)
    protected readonly repository: Repository<MeasurementUnit>,
  ) {
    super(repository);
  }
}
