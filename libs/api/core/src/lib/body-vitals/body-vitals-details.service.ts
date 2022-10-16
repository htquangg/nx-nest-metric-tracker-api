import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { TemperatureService } from './temperature';
import { DistanceService } from './distance';
import { BodyVitalsService } from './body-vitals.service';
import { GetBodyVitalsPayload, UpsertBodyVitalsPayload } from './dtos';
import { MeasurementUnitService } from '../measurement-unit';
import { ExchangeRateService } from '../exchange-rate';
import { DEFAULT_DISTANCE_UNIT, DEFAULT_TEMPERATURE_UNIT } from '../constants';

import { EverfitBaseService } from '@everfit/api/common';
import {
  BodyDistance,
  BodyTemperature,
  BodyVitalsDetailsLog,
  MeasurementUnitProps,
} from '@everfit/api/entities';
import { check, is, randomStringGenerator } from '@everfit/shared/utils';
import { InjectPostgresConfig } from '@everfit/api/config';
import { PostgresConfig } from '@everfit/api/types';
import { CachingService } from '@everfit/api/services';
import { randomBytes } from 'crypto';
import { BodyVitalsEvents } from './constants';
import { json } from 'stream/consumers';

const CACHE_PREFIX_BODY_VITALS_DETAILS = '__body_vitals_details_';

@Injectable()
export class BodyVitalsDetailsService extends EverfitBaseService<BodyVitalsDetailsLog> {
  constructor(
    @InjectPostgresConfig() protected readonly postgresConfig: PostgresConfig,
    @InjectRepository(BodyVitalsDetailsLog)
    protected readonly repository: Repository<BodyVitalsDetailsLog>,
    protected readonly cacheService: CachingService,
    protected readonly eventEmitter: EventEmitter2,
    protected readonly measurementUnitService: MeasurementUnitService,
    protected readonly exchangeRateService: ExchangeRateService,
    protected readonly bodyVitalsService: BodyVitalsService,
    protected readonly distanceService: DistanceService,
    protected readonly temperatureService: TemperatureService,
  ) {
    super(repository);
  }

  async findByBodyVitalsLogId(
    bodyVitalsLogId: string,
    payload?: Pick<GetBodyVitalsPayload, 'distanceUnit' | 'temperatureUnit'>,
  ): Promise<BodyVitalsDetailsLog[]> {
    const bodyVitalsDetailsList = await this.getByBodyVitalsLogId(
      bodyVitalsLogId,
    );

    // TOIMPROVE: remove duplicate code

    const { distanceUnit, temperatureUnit } = payload;

    const newBodyVitalsDetailsList = await Promise.all(
      bodyVitalsDetailsList.map(async (bodyVitalsDetails) => {
        if (is.notNil(bodyVitalsDetails.bodyTemperature)) {
          const temperatureUnitString =
            (temperatureUnit as unknown as string) || DEFAULT_TEMPERATURE_UNIT;

          const { targetMeasurementUnit, exchangeRate } =
            await this.getExchangeRateInfoFromUnitIdAndSymbol(
              bodyVitalsDetails.bodyTemperature.measurementUnitId,
              temperatureUnitString as unknown as string,
            );

          const bodyTemperature = {
            ...bodyVitalsDetails.bodyTemperature,
            temperature:
              bodyVitalsDetails.bodyTemperature.temperature * exchangeRate,
            measurementUnit: targetMeasurementUnit.symbol,
          } as any as BodyTemperature;

          delete bodyTemperature.measurementUnitId;

          bodyVitalsDetails = {
            ...bodyVitalsDetails,
            bodyTemperature,
          } as BodyVitalsDetailsLog;
        }

        if (is.notNil(bodyVitalsDetails.bodyDistance)) {
          const distanceUnitString =
            (distanceUnit as unknown as string) || DEFAULT_DISTANCE_UNIT;

          const { targetMeasurementUnit, exchangeRate } =
            await this.getExchangeRateInfoFromUnitIdAndSymbol(
              bodyVitalsDetails.bodyDistance.measurementUnitId,
              distanceUnitString,
            );

          const bodyDistance = {
            ...bodyVitalsDetails.bodyDistance,
            distance: bodyVitalsDetails.bodyDistance.distance * exchangeRate,
            measurementUnit: targetMeasurementUnit.symbol,
          } as any as BodyDistance;

          delete bodyDistance.measurementUnitId;

          bodyVitalsDetails = {
            ...bodyVitalsDetails,
            bodyDistance,
          } as BodyVitalsDetailsLog;
        }

        return bodyVitalsDetails;
      }),
    );

    return newBodyVitalsDetailsList;
  }

  async getByBodyVitalsLogId(
    bodyVitalsLogId: string,
  ): Promise<BodyVitalsDetailsLog[]> {
    return await this.cacheService.get(
      `${CACHE_PREFIX_BODY_VITALS_DETAILS}_list_${bodyVitalsLogId}`,
      () =>
        this.find({
          where: { bodyVitalsLogId },
          relations: ['bodyTemperature', 'bodyDistance'],
        }),
    );
  }

  async findOneById(
    id: string,
    payload?: Pick<GetBodyVitalsPayload, 'distanceUnit' | 'temperatureUnit'>,
  ): Promise<BodyVitalsDetailsLog | null> {
    let bodyVitalsDetails = await this.findOne({
      where: {
        id,
      },
      relations: ['bodyTemperature', 'bodyDistance'],
    });

    if (is.nil(bodyVitalsDetails)) {
      return Promise.resolve(null);
    }

    const { distanceUnit, temperatureUnit } = payload;

    // TOIMPROVE: remove duplicate code

    if (is.notNil(bodyVitalsDetails.bodyTemperature)) {
      const temperatureUnitString =
        (temperatureUnit as unknown as string) || DEFAULT_TEMPERATURE_UNIT;

      const { targetMeasurementUnit, exchangeRate } =
        await this.getExchangeRateInfoFromUnitIdAndSymbol(
          bodyVitalsDetails.bodyTemperature.measurementUnitId,
          temperatureUnitString as unknown as string,
        );

      const bodyTemperature = {
        ...bodyVitalsDetails.bodyTemperature,
        temperature:
          bodyVitalsDetails.bodyTemperature.temperature * exchangeRate,
        measurementUnit: targetMeasurementUnit.symbol,
      } as any as BodyTemperature;

      delete bodyTemperature.measurementUnitId;

      bodyVitalsDetails = {
        ...bodyVitalsDetails,
        bodyTemperature,
      } as BodyVitalsDetailsLog;
    }

    if (is.notNil(bodyVitalsDetails.bodyDistance)) {
      const distanceUnitString =
        (distanceUnit as unknown as string) || DEFAULT_DISTANCE_UNIT;

      const { targetMeasurementUnit, exchangeRate } =
        await this.getExchangeRateInfoFromUnitIdAndSymbol(
          bodyVitalsDetails.bodyDistance.measurementUnitId,
          distanceUnitString,
        );

      const bodyDistance = {
        ...bodyVitalsDetails.bodyDistance,
        distance: bodyVitalsDetails.bodyDistance.distance * exchangeRate,
        measurementUnit: targetMeasurementUnit.symbol,
      } as any as BodyDistance;

      delete bodyDistance.measurementUnitId;

      bodyVitalsDetails = {
        ...bodyVitalsDetails,
        bodyDistance,
      } as BodyVitalsDetailsLog;
    }

    return bodyVitalsDetails;
  }

  async upsertByUserId(
    userId: string,
    data: UpsertBodyVitalsPayload,
  ): Promise<BodyVitalsDetailsLog> {
    const bodyVitalsLog = await this.bodyVitalsService.findOneByUserId(userId);

    const newBodyVitalsDetailsLog = (await this.save(
      this.create({
        id: randomStringGenerator(),
        bodyVitalsLogId: bodyVitalsLog.id,
      }),
    )) as BodyVitalsDetailsLog;

    const bodyDistance = await this.distanceService.upsert({
      ...data.distance,
      bodyVitalsDetailsLogId: newBodyVitalsDetailsLog.id,
    });
    const bodyTemperature = await this.temperatureService.upsert({
      ...data.temperature,
      bodyVitalsDetailsLogId: newBodyVitalsDetailsLog.id,
    });

    // create new payload
    // TOIMPROVE: json builder data
    delete newBodyVitalsDetailsLog.jsonData;
    const jsonData = JSON.stringify({
      ...newBodyVitalsDetailsLog,
      distance: bodyDistance,
      temperature: bodyTemperature,
    });

    this.eventEmitter.emitAsync(BodyVitalsEvents.NewBodyVitalsDetails, {
      bodyVitalsLogId: bodyVitalsLog.id,
      jsonData,
    });

    return (await this.save({
      ...newBodyVitalsDetailsLog,
    })) as unknown as BodyVitalsDetailsLog;
  }

  protected async getExchangeRateInfoFromUnitIdAndSymbol(
    unitId: string,
    symbol: string,
  ): Promise<{
    sourceMeasurementUnit: MeasurementUnitProps;
    targetMeasurementUnit: MeasurementUnitProps;
    exchangeRate: number;
  }> {
    // TOIMPROVE: optional input
    const sourceMeasurementUnit = await this.measurementUnitService.getOneById(
      unitId,
    );
    const targetMeasurementUnit =
      await this.measurementUnitService.getOneBySymbol(symbol);
    check(
      [sourceMeasurementUnit, targetMeasurementUnit],
      is.notNil,
      new InternalServerErrorException(
        `MeasurementUnit is not definded: ${unitId} --> ${symbol}`,
      ),
    );

    const exchangeRate = await this.exchangeRateService.getRate(
      sourceMeasurementUnit.symbol,
      targetMeasurementUnit.symbol,
    );

    return {
      sourceMeasurementUnit,
      targetMeasurementUnit,
      exchangeRate,
    };
  }
}
