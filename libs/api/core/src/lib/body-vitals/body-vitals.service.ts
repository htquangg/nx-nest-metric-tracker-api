import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';

import { DistanceService } from './distance';
import { BetweenOneDay } from '../utils';
import { UpsertBodyVitalsDto } from '../measurement';

import { EverfitBaseService } from '@everfit/api/common';
import { BodyVitalsLog, BodyVitalsLogProps } from '@everfit/api/entities';
import { is, randomStringGenerator } from '@everfit/shared/utils';
import { InjectPostgresConfig } from '@everfit/api/config';
import { PostgresConfig } from '@everfit/api/types';

@Injectable()
export class BodyVitalsService extends EverfitBaseService<BodyVitalsLog> {
  constructor(
    @InjectRepository(BodyVitalsLog)
    protected readonly repository: Repository<BodyVitalsLog>,
    @InjectPostgresConfig() protected readonly postgresConfig: PostgresConfig,
    protected readonly distanceService: DistanceService,
  ) {
    super(repository);
  }

  async getDetailBodyVitals(userId: string): Promise<BodyVitalsLog> {
    const bodyVitalsLog = await this.repository.findOne({
      where: {
        userId,
        createdAt: BetweenOneDay,
      },
      relations: ['bodyDistance', 'bodyTemperature'],
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
        await this.distanceService.upsertDetailBodyDistance(
          bodyVitalsLog.id,
          data.distance,
          transaction,
        );
      },
    );

    return bodyVitalsLog;
  }
}
