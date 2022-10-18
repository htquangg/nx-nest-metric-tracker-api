import {
  Inject,
  forwardRef,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository, In } from 'typeorm';
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
import { BodyVitalsEvents } from './constants';

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
    @Inject(forwardRef(() => BodyVitalsService))
    protected readonly bodyVitalsService: BodyVitalsService,
    protected readonly distanceService: DistanceService,
    protected readonly temperatureService: TemperatureService,
  ) {
    super(repository);
  }

  async findByBodyVitalsLogId(
    bodyVitalsLogId: string,
  ): Promise<BodyVitalsDetailsLog[]> {
    return await this.find({
      where: { bodyVitalsLogId },
      relations: ['bodyTemperature', 'bodyDistance'],
    });
  }

  async findByBodyVitalsLogIds(
    bodyVitalsLogIds: string | string[],
    payload?: Pick<GetBodyVitalsPayload, 'distanceUnit' | 'temperatureUnit'>,
  ): Promise<BodyVitalsDetailsLog[]> {
    let bodyVitalsDetailsList;

    if (!is.array(bodyVitalsLogIds)) {
      bodyVitalsDetailsList = await this.findByBodyVitalsLogId(
        bodyVitalsLogIds,
      );
    } else {
      bodyVitalsDetailsList = await this.find({
        where: {
          bodyVitalsLogId: In(bodyVitalsLogIds),
        },
        relations: ['bodyTemperature', 'bodyDistance'],
      });
    }

    // TOIMPROVE: remove duplicate code
    const newBodyVitalsDetailsList =
      await this.convertBodyVitalsDetailsToTargetUnit(
        bodyVitalsDetailsList,
        payload,
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

  async getByBodyVitalsLogIds(
    bodyVitalsLogIds: string[],
  ): Promise<BodyVitalsDetailsLog[]> {
    return await this.cacheService.get(
      `${CACHE_PREFIX_BODY_VITALS_DETAILS}_list_body`,
      () =>
        this.find({
          where: {
            bodyVitalsLogId: In(bodyVitalsLogIds),
          },
          relations: ['bodyTemperature', 'bodyDistance'],
        }),
    );
  }

  async findOneById(
    id: string,
    payload?: Pick<GetBodyVitalsPayload, 'distanceUnit' | 'temperatureUnit'>,
  ): Promise<BodyVitalsDetailsLog | null> {
    const bodyVitalsDetails = await this.findOne({
      where: {
        id,
      },
      relations: ['bodyTemperature', 'bodyDistance'],
    });
    check(bodyVitalsDetails, is.notNil, new NotFoundException(id));

    const newBodyVitalsDetailsList =
      await this.convertBodyVitalsDetailsToTargetUnit(
        [bodyVitalsDetails],
        payload,
      );

    return newBodyVitalsDetailsList[0];
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
      bodyDistance,
      bodyTemperature,
    });

    this.eventEmitter.emitAsync(BodyVitalsEvents.NewBodyVitalsDetails, {
      bodyVitalsLogId: bodyVitalsLog.id,
      jsonData,
    });

    return (await this.save({
      ...newBodyVitalsDetailsLog,
    })) as unknown as BodyVitalsDetailsLog;
  }

  public async convertBodyVitalsDetailsToTargetUnit(
    bodyVitalsDetailsList: BodyVitalsDetailsLog[],
    payload?: Pick<GetBodyVitalsPayload, 'distanceUnit' | 'temperatureUnit'>,
  ): Promise<BodyVitalsDetailsLog[]> {
    // TOIMPROVE: move this to after interceptor
    const { distanceUnit, temperatureUnit } = payload;

    return await Promise.all(
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
  }
  protected async getExchangeRateInfoFromUnitIdAndSymbol(
    source: string,
    to: string,
  ): Promise<{
    sourceMeasurementUnit: MeasurementUnitProps;
    targetMeasurementUnit: MeasurementUnitProps;
    exchangeRate: number;
  }> {
    const sourceMeasurementUnit =
      await this.measurementUnitService.getOneByIdOrSymbol(source);
    const targetMeasurementUnit =
      await this.measurementUnitService.getOneByIdOrSymbol(to);
    check(
      [sourceMeasurementUnit, targetMeasurementUnit],
      is.notNil,
      new InternalServerErrorException(
        `MeasurementUnit is not definded: ${source} --> ${to}`,
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
