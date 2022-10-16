import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';

import { GetBodyVitalsDto, UpsertBodyVitalsDto } from './dtos';
import { TemperatureService } from './temperature';
import { DistanceService } from './distance';
import { BetweenOneDay } from '../utils';

import { AuthUserDto, EverfitBaseService } from '@everfit/api/common';
import {
  BodyVitalsLog,
  BodyVitalsLogProps,
  ENTITY_NAME,
} from '@everfit/api/entities';
import { is, randomStringGenerator } from '@everfit/shared/utils';
import { InjectPostgresConfig } from '@everfit/api/config';
import { PostgresConfig } from '@everfit/api/types';

@Injectable()
export class BodyVitalsService extends EverfitBaseService<BodyVitalsLog> {
  constructor(
    @InjectPostgresConfig() protected readonly postgresConfig: PostgresConfig,
    @InjectRepository(BodyVitalsLog)
    protected readonly repository: Repository<BodyVitalsLog>,
    protected readonly distanceService: DistanceService,
    protected readonly temperatureService: TemperatureService,
  ) {
    super(repository);
  }

  async getBodyVitalsLog(
    currentUser: AuthUserDto,
    data?: GetBodyVitalsDto,
  ): Promise<BodyVitalsLog> {
    return await this.getDetailBodyVitals(currentUser.userId, data);
  }

  async upsertBodyVitalsLog(
    currentUser: AuthUserDto,
    data: UpsertBodyVitalsDto,
  ) {
    return await this.upsertDetailBodyVitals(currentUser.userId, data);
  }

  async getDetailBodyVitals(
    userId: string,
    data?: GetBodyVitalsDto,
  ): Promise<BodyVitalsLog> {
    const bodyVitalsLog = await this.repository.findOne({
      where: {
        userId,
        createdAt: BetweenOneDay,
      },
      relations: [ENTITY_NAME.BODY_DISTANCE, ENTITY_NAME.BODY_TEMPERATURE],
    });

    if (is.nil(bodyVitalsLog)) {
      const payload: BodyVitalsLogProps = {
        id: randomStringGenerator(),
        userId,
        jsonData: null,
        bodyDistance: null,
        bodyTemperature: null,
      };
      return (await this.save(this.create(payload))) as BodyVitalsLog;
    }

    return bodyVitalsLog;
  }

  async upsertDetailBodyVitals(
    userId: string,
    data: UpsertBodyVitalsDto,
  ): Promise<BodyVitalsLog> {
    const bodyVitalsLog = await this.getDetailBodyVitals(userId);

    await getManager(this.postgresConfig.database).transaction(
      async (transaction) => {
        const bodyDistance =
          await this.distanceService.upsertDetailBodyDistance(
            bodyVitalsLog.id,
            data.distance,
            transaction,
          );
        const bodyTemperature =
          await this.temperatureService.upsertDetailBodyTemperature(
            bodyVitalsLog.id,
            data.temperature,
            transaction,
          );

        // create new payload
        // TOIMPROVE: json builder data
        delete bodyVitalsLog.jsonData;
        const newBodyVitalsLog = {
          ...bodyVitalsLog,
        };
        const jsonData = JSON.stringify({
          distance: bodyDistance.jsonData,
          temperature: bodyTemperature.jsonData,
        });

        return { ...newBodyVitalsLog, jsonData };
      },
    );

    return bodyVitalsLog;
  }
}
