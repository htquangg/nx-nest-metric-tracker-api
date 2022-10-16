import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DEFAULT_DISTANCE_UNIT, DEFAULT_TEMPERATURE_UNIT } from '../constants';

import { MeasurementUnit } from '@everfit/api/entities';
import { EverfitBaseService } from '@everfit/api/common';
import { CachingService } from '@everfit/api/services';

const CACHE_PREFIX_MEASUREMENT_UNIT = '__measurement_unit_';

@Injectable()
export class MeasurementUnitService extends EverfitBaseService<MeasurementUnit> {
  constructor(
    @InjectRepository(MeasurementUnit)
    protected readonly repository: Repository<MeasurementUnit>,
    protected readonly cacheService: CachingService,
  ) {
    super(repository);
  }

  async getOneById(id: string): Promise<MeasurementUnit> {
    return await this.cacheService.get(
      `${CACHE_PREFIX_MEASUREMENT_UNIT}_${id}`,
      () => this.findOne({ where: { id } }),
    );
  }

  async getOneBySymbol(symbol: string): Promise<MeasurementUnit> {
    return await this.cacheService.get(
      `${CACHE_PREFIX_MEASUREMENT_UNIT}_${symbol}`,
      () => this.findOne({ where: { symbol } }),
    );
  }

  async getDefaultTemperatureUnit(): Promise<MeasurementUnit> {
    return await this.cacheService.get(
      `${CACHE_PREFIX_MEASUREMENT_UNIT}_${DEFAULT_TEMPERATURE_UNIT}`,
      () => this.getOneBySymbol(DEFAULT_TEMPERATURE_UNIT),
    );
  }

  async getDefaultDistanceUnit(): Promise<MeasurementUnit> {
    return await this.cacheService.get(
      `${CACHE_PREFIX_MEASUREMENT_UNIT}_${DEFAULT_DISTANCE_UNIT}`,
      () => this.getOneBySymbol(DEFAULT_DISTANCE_UNIT),
    );
  }
}
