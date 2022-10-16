import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, getManager, Repository } from 'typeorm';

import { GetBodyVitalsPayload, UpsertBodyVitalsPayload } from './dtos';
import { TemperatureService } from './temperature';
import { DistanceService } from './distance';
import { BetweenOneDay, endDayNow, startDayNow } from '../utils';

import { EverfitBaseService } from '@everfit/api/common';
import {
  BodyVitalsLog,
  BodyVitalsLogProps,
  ENTITY_NAME,
} from '@everfit/api/entities';
import { is, randomStringGenerator } from '@everfit/shared/utils';
import { InjectPostgresConfig } from '@everfit/api/config';
import { PostgresConfig } from '@everfit/api/types';
import { CachingService } from '@everfit/api/services';

const CACHE_PREFIX_BODY_VITALS = '__body_vitals_';

@Injectable()
export class BodyVitalsService extends EverfitBaseService<BodyVitalsLog> {
  constructor(
    @InjectPostgresConfig() protected readonly postgresConfig: PostgresConfig,
    @InjectRepository(BodyVitalsLog)
    protected readonly repository: Repository<BodyVitalsLog>,
    protected readonly cacheService: CachingService,
    protected readonly distanceService: DistanceService,
    protected readonly temperatureService: TemperatureService,
  ) {
    super(repository);
  }

  async findByUserId(
    userId: string,
    payload?: Partial<
      Pick<GetBodyVitalsPayload, 'distanceUnit' | 'temperatureUnit'>
    >,
  ): Promise<BodyVitalsLog[]> {
    return await this.find({ where: { userId } });
  }

  async findOneById(
    id: string,
    payload?: Pick<GetBodyVitalsPayload, 'distanceUnit' | 'temperatureUnit'>,
  ): Promise<BodyVitalsLog> {
    const bodyVitalsLog = await this.repository.findOne({
      where: {
        id,
      },
      relations: ['bodyVitalDetailsLogs'],
    });

    if (is.notNil(payload)) {
      const { distanceUnit, temperatureUnit } = payload;

      if (is.notNil(distanceUnit)) {
      }

      if (is.notNil(temperatureUnit)) {
      }
    }

    return bodyVitalsLog;
  }

  async findOneByUserId(
    userId: string,
    payload?: Pick<GetBodyVitalsPayload, 'distanceUnit' | 'temperatureUnit'>,
  ): Promise<BodyVitalsLog> {
    const bodyVitalsLog = await this.repository.findOne({
      where: {
        userId,
        createdAt: BetweenOneDay as any,
      },
      // relations: [ENTITY_NAME.BODY_VITALS_DETAILS_LOG],
    });

    if (is.nil(bodyVitalsLog)) {
      const payload: BodyVitalsLogProps = {
        id: randomStringGenerator(),
        userId,
        jsonData: null,
        bodyVitalDetailsLogs: null,
      };
      return (await this.save(this.create(payload))) as BodyVitalsLog;
    }

    return bodyVitalsLog;
  }

  async upsertByUserId(
    userId: string,
    data: UpsertBodyVitalsPayload,
  ): Promise<BodyVitalsLog> {
    // const bodyVitalsLog = await this.findOneByUserId(userId);
    // await getManager(this.postgresConfig.database).transaction(
    //   async (transaction) => {
    //     const bodyDistance = await this.distanceService.upsert(
    //       { ...data.distance, bodyVitalsDetailsLogId: bodyVitalsLog.id },
    //       transaction,
    //     );
    //     const bodyTemperature = await this.temperatureService.upsert(
    //       { ...data.temperature, bodyVitalsDetailsLogId: bodyVitalsLog.id },
    //       transaction,
    //     );
    //     // create new payload
    //     // TOIMPROVE: json builder data
    //     delete bodyVitalsLog.jsonData;
    //     const newBodyVitalsLog = {
    //       ...bodyVitalsLog,
    //     };
    //     const jsonData = JSON.stringify({
    //       distance: bodyDistance.jsonData,
    //       temperature: bodyTemperature.jsonData,
    //     });
    //     return { ...newBodyVitalsLog, jsonData };
    //   },
    // );
    // return bodyVitalsLog;
  }

  async getOneByUserId(
    userId: string,
    payload?: Pick<GetBodyVitalsPayload, 'distanceUnit' | 'temperatureUnit'>,
  ): Promise<BodyVitalsLog> {
    return await this.cacheService.get(
      `${CACHE_PREFIX_BODY_VITALS}_${userId}`,
      async () => {
        const bodyVitalsLog = await this.repository.findOne({
          where: {
            userId,
            createdAt: BetweenOneDay as any,
          },
        });
        return bodyVitalsLog;
      },
    );
  }
}
