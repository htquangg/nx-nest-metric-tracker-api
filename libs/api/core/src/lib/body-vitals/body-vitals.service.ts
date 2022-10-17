import { forwardRef, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DistanceService } from './distance';
import { TemperatureService } from './temperature';
import { GetBodyVitalsPayload, UpsertBodyVitalsPayload } from './dtos';
import { BodyVitalsDetailsService } from './body-vitals-details.service';
import { UserService } from '../user';
import { BetweenOneDay } from '../utils';

import { EverfitBaseService } from '@everfit/api/common';
import {
  BodyVitalsDetailsLog,
  BodyVitalsLog,
  BodyVitalsLogProps,
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
    protected readonly userService: UserService,
    @Inject(forwardRef(() => BodyVitalsDetailsService))
    private bodyVitalsDetailsService: BodyVitalsDetailsService,
  ) {
    super(repository);
  }

  async findLastVitals(
    userId: string,
    payload?: Partial<
      Pick<
        GetBodyVitalsPayload,
        'distanceUnit' | 'temperatureUnit' | 'lastOneMonth' | 'lastTwoMonths'
      >
    >,
  ): Promise<BodyVitalsLog[]> {
    const user = await this.userService.findOne({
      where: {
        id: userId,
      },
    });
    if (is.nil(user)) return [];

    const { lastTwoMonths } = payload;

    let dataOutput: any;

    if (lastTwoMonths) {
      dataOutput = user.lastVitalsLogTwoMonths;
    } else {
      dataOutput = user.lastVitalsLogTwoMonths;
    }

    if (is.nil(dataOutput)) return [];

    const dataOutputParse = JSON.parse(dataOutput) as BodyVitalsLog[];

    const formatDataOut = await Promise.all(
      dataOutputParse['lastBodyVitalsLog'].map(async (bodyVitalsLog) => {
        const bodyVitalsDetailsList = Object.values(
          bodyVitalsLog,
        )[0] as unknown as BodyVitalsDetailsLog[];
        const newBodyVitalsDetailsList =
          await this.bodyVitalsDetailsService.convertBodyVitalsDetailsToTargetUnit(
            bodyVitalsDetailsList.map((bodyVitalsDetails) =>
              JSON.parse(bodyVitalsDetails as any),
            ),
            payload,
          );
        return {
          [`${Object.keys(bodyVitalsLog)[0]}`]: newBodyVitalsDetailsList,
        };
      }),
    );

    return formatDataOut;
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
