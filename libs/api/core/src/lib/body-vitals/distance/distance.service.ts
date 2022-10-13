import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';

import { Distance } from '../../measurement';
import { BetweenOneDay } from '../../utils';
import { DEFAULT_DISTANCE_UNIT, DEFAULT_DISTANCE_VALUE } from '../../constants';

import { EntityProps, EverfitBaseService } from '@everfit/api/common';
import {
  BodyDistance,
  BodyDistanceProps,
  ExchangeRate,
  MeasurementUnit,
} from '@everfit/api/entities';
import { is, check, randomStringGenerator } from '@everfit/shared/utils';

@Injectable()
export class DistanceService extends EverfitBaseService<BodyDistance> {
  constructor(
    @InjectRepository(BodyDistance)
    protected readonly repository: Repository<BodyDistance>,
    @InjectRepository(MeasurementUnit)
    protected readonly measurementUnitRepository: Repository<MeasurementUnit>,
    @InjectRepository(ExchangeRate)
    protected readonly exchangeRateRepository: Repository<ExchangeRate>,
  ) {
    super(repository);
  }

  async getDetailBodyDistance(
    bodyVitalsLogId: string,
    transaction?: EntityManager,
  ): Promise<BodyDistance> {
    const bodyVitalsLog = await this.repository.findOne({
      where: {
        bodyVitalsLogId,
        createdAt: BetweenOneDay,
      },
      relations: ['bodyDistance', 'bodyTemperature'],
    });

    if (is.nil(bodyVitalsLog)) {
      const measurementUnit = await this.measurementUnitRepository.findOne({
        where: { symbol: DEFAULT_DISTANCE_UNIT },
      });

      if (is.nil(measurementUnit)) {
        throw new InternalServerErrorException(
          'Distance Unit is not definded!',
        );
      }

      const payload: BodyDistanceProps = {
        id: randomStringGenerator(),
        bodyVitalsLogId,
        distance: DEFAULT_DISTANCE_VALUE,
        measurementUnitId: measurementUnit.id,
        jsonData: null,
      };

      return (await this.save(this.create(payload))) as BodyDistance;
    }

    return bodyVitalsLog;
  }

  async upsertDetailBodyDistance(
    bodyVitalsLogId: string,
    data: Distance,
    transaction?: EntityManager,
  ): Promise<BodyDistance> {
    const bodyDistance = await this.getDetailBodyDistance(bodyVitalsLogId);

    if (bodyDistance.distance === DEFAULT_DISTANCE_VALUE) {
      const measurementUnit = await this.measurementUnitRepository.findOne({
        where: { symbol: data.unit as unknown as string },
      });
      check(
        measurementUnit,
        is.notNil,
        new InternalServerErrorException(
          `Distance Unit is not definded: ${measurementUnit}`,
        ),
      );

      const payload = {
        ...bodyDistance,
        distance: data.value,
        measurementUnitId: measurementUnit.id,
      };

      return (await this.save(this.create(payload))) as BodyDistance;
    }

    const sourceMeasurementUnit = await this.measurementUnitRepository.findOne({
      where: { id: bodyDistance.measurementUnitId },
    });
    const targetMeasurementUnit = await this.measurementUnitRepository.findOne({
      where: { symbol: data.unit as unknown as string },
    });
    check(
      [sourceMeasurementUnit, targetMeasurementUnit],
      is.notNil,
      new InternalServerErrorException(
        `DistanceUnit is not definded: ${sourceMeasurementUnit} -- ${targetMeasurementUnit}`,
      ),
    );

    const exchangeRate = await this.exchangeRateRepository.findOne({
      where: { source: sourceMeasurementUnit.id, to: targetMeasurementUnit.id },
    });
    check(
      exchangeRate,
      is.notNil,
      new InternalServerErrorException(
        `ExchangeRate is not definded: ${sourceMeasurementUnit} -- ${targetMeasurementUnit}`,
      ),
    );

    const newBodyDistance: EntityProps<BodyDistance> = {
      ...bodyDistance,
      distance: bodyDistance.distance * exchangeRate.rate + data.value,
      measurementUnitId: targetMeasurementUnit.id,
    };

    await this.save(newBodyDistance);

    return newBodyDistance as BodyDistance;
  }
}
