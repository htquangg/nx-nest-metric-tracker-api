import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { BetweenOneDay } from '../../utils';
import { TemperatureDto } from '../dtos';
import {
  DEFAULT_TEMPERATURE_UNIT,
  DEFAULT_TEMPERATURE_VALUE,
} from '../../constants';

import { EntityProps, EverfitBaseService } from '@everfit/api/common';
import {
  BodyTemperature,
  BodyTemperatureProps,
  MeasurementUnit,
  ExchangeRate,
} from '@everfit/api/entities';
import { is, check, randomStringGenerator } from '@everfit/shared/utils';

@Injectable()
export class TemperatureService extends EverfitBaseService<BodyTemperature> {
  constructor(
    @InjectRepository(BodyTemperature)
    protected readonly repository: Repository<BodyTemperature>,
    @InjectRepository(MeasurementUnit)
    protected readonly measurementUnitRepository: Repository<MeasurementUnit>,
    @InjectRepository(ExchangeRate)
    protected readonly exchangeRateRepository: Repository<ExchangeRate>,
  ) {
    super(repository);
  }

  async getDetailBodyTemperature(
    bodyVitalsLogId: string,
    transaction?: EntityManager,
  ): Promise<BodyTemperature> {
    const bodyTemperature = await this.repository.findOne({
      where: {
        bodyVitalsLogId,
        createdAt: BetweenOneDay,
      },
      relations: ['bodyVitalsLog'],
    });

    if (is.nil(bodyTemperature)) {
      const measurementUnit = await this.measurementUnitRepository.findOne({
        where: { symbol: DEFAULT_TEMPERATURE_UNIT },
      });

      if (is.nil(measurementUnit)) {
        throw new InternalServerErrorException(
          'TemperatureUnit is not definded!',
        );
      }

      const payload: BodyTemperatureProps = {
        id: randomStringGenerator(),
        bodyVitalsLogId,
        temperature: DEFAULT_TEMPERATURE_VALUE,
        measurementUnitId: measurementUnit.id,
        jsonData: null,
      };

      return (await this.save(this.create(payload))) as BodyTemperature;
    }

    return bodyTemperature;
  }

  async upsertDetailBodyTemperature(
    bodyVitalsLogId: string,
    data: TemperatureDto,
    transaction?: EntityManager,
  ): Promise<BodyTemperature> {
    const bodyTemperature = await this.getDetailBodyTemperature(
      bodyVitalsLogId,
    );

    if (bodyTemperature.temperature === DEFAULT_TEMPERATURE_VALUE) {
      const measurementUnit = await this.measurementUnitRepository.findOne({
        where: { symbol: data.unit as unknown as string },
      });
      check(
        measurementUnit,
        is.notNil,
        new InternalServerErrorException(
          `TemperatureUnit is not definded: ${measurementUnit}`,
        ),
      );

      const payload = {
        ...bodyTemperature,
        temperature: data.value,
        measurementUnitId: measurementUnit.id,
      };

      return (await this.save(this.create(payload))) as BodyTemperature;
    }

    const sourceMeasurementUnit = await this.measurementUnitRepository.findOne({
      where: { id: bodyTemperature.measurementUnitId },
    });
    const targetMeasurementUnit = await this.measurementUnitRepository.findOne({
      where: { symbol: data.unit as unknown as string },
    });
    check(
      [sourceMeasurementUnit, targetMeasurementUnit],
      is.notNil,
      new InternalServerErrorException(
        `TemperatureUnit is not definded: ${sourceMeasurementUnit} -- ${targetMeasurementUnit}`,
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

    // create new payload
    // TOIMPROVE: json builder data
    delete bodyTemperature.jsonData;
    const newBodyTemperature: EntityProps<BodyTemperature> = {
      ...bodyTemperature,
      temperature: bodyTemperature.temperature * exchangeRate.rate + data.value,
      measurementUnitId: targetMeasurementUnit.id,
    };
    const jsonData = JSON.stringify(newBodyTemperature);

    await this.save({ ...newBodyTemperature, jsonData });

    return newBodyTemperature as BodyTemperature;
  }
}
