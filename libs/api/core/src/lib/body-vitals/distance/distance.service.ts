import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';

import { DistanceDto } from '../dtos';
import { BetweenOneDay } from '../../utils';
import { DEFAULT_DISTANCE_UNIT, DEFAULT_DISTANCE_VALUE } from '../../constants';
import { MeasurementUnitService } from '../../measurement-unit';
import { ExchangeRateService } from '../../exchange-rate';

import { EntityProps, EverfitBaseService } from '@everfit/api/common';
import {
  BodyDistance,
  BodyDistanceProps,
  ENTITY_NAME,
} from '@everfit/api/entities';
import { is, check, randomStringGenerator } from '@everfit/shared/utils';

@Injectable()
export class DistanceService extends EverfitBaseService<BodyDistance> {
  constructor(
    @InjectRepository(BodyDistance)
    protected readonly repository: Repository<BodyDistance>,
    protected readonly measurementUnitService: MeasurementUnitService,
    protected readonly exchangeRateService: ExchangeRateService,
  ) {
    super(repository);
  }

  async getDetailBodyDistance(
    bodyVitalsLogId: string,
    transaction?: EntityManager,
  ): Promise<BodyDistance> {
    const bodyDistance = await this.repository.findOne({
      where: {
        bodyVitalsLogId,
        createdAt: BetweenOneDay,
      },
      relations: [ENTITY_NAME.BODY_VITALS_LOG],
    });

    if (is.nil(bodyDistance)) {
      const measurementUnit = await this.measurementUnitService.findOne({
        where: { symbol: DEFAULT_DISTANCE_UNIT },
      });

      if (is.nil(measurementUnit)) {
        throw new InternalServerErrorException('DistanceUnit is not definded!');
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

    return bodyDistance;
  }

  async upsertDetailBodyDistance(
    bodyVitalsLogId: string,
    data: DistanceDto,
    transaction?: EntityManager,
  ): Promise<BodyDistance> {
    const bodyDistance = await this.getDetailBodyDistance(bodyVitalsLogId);

    if (bodyDistance.distance === DEFAULT_DISTANCE_VALUE) {
      const measurementUnit = await this.measurementUnitService.findOne({
        where: { symbol: data.unit as unknown as string },
      });
      check(
        measurementUnit,
        is.notNil,
        new InternalServerErrorException(
          `DistanceUnit is not definded: ${measurementUnit}`,
        ),
      );

      const payload = {
        ...bodyDistance,
        distance: data.value,
        measurementUnitId: measurementUnit.id,
      };

      return (await this.save(this.create(payload))) as BodyDistance;
    }

    const sourceMeasurementUnit = await this.measurementUnitService.findOne({
      where: { id: bodyDistance.measurementUnitId },
    });
    const targetMeasurementUnit = await this.measurementUnitService.findOne({
      where: { symbol: data.unit as unknown as string },
    });
    check(
      [sourceMeasurementUnit, targetMeasurementUnit],
      is.notNil,
      new InternalServerErrorException(
        `DistanceUnit is not definded: ${sourceMeasurementUnit} -- ${targetMeasurementUnit}`,
      ),
    );

    const exchangeRate = await this.exchangeRateService.findOne({
      where: { source: sourceMeasurementUnit.id, to: targetMeasurementUnit.id },
    });
    check(
      exchangeRate,
      is.notNil,
      new InternalServerErrorException(
        `ExchangeRate is not definded: ${sourceMeasurementUnit} -- ${targetMeasurementUnit}`,
      ),
    );

    // create new payload
    // TOIMPROVE: json builder data
    delete bodyDistance.jsonData;
    const newBodyDistance: EntityProps<BodyDistance> = {
      ...bodyDistance,
      distance: bodyDistance.distance * exchangeRate.rate + data.value,
      measurementUnitId: targetMeasurementUnit.id,
    };
    const jsonData = JSON.stringify(newBodyDistance);

    await this.save({ ...newBodyDistance, jsonData });

    return newBodyDistance as BodyDistance;
  }
}
