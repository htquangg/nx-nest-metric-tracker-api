import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import {
  UserService,
  BodyVitalsService,
  BetweenOneMonth,
  BetweenTwoMonths,
} from '@everfit/api/core';
import { is } from '@everfit/shared/utils';
import { BodyVitalsLog, User } from '@everfit/api/entities';

@Injectable()
export class LastVitalsLogCronJob {
  constructor(
    protected readonly userService: UserService,
    protected readonly bodyVitalsLogService: BodyVitalsService,
  ) {}

  @Cron('0 0 0 * * *') // At 00:00 everyday
  async buildLastVitalsLogLastOneMonth(): Promise<void> {
    const users = await this.userService.find({
      where: { bodyVitalLogs: { createdAt: BetweenOneMonth as any } },
      relations: ['bodyVitalLogs'],
    });
    if (is.notNil(users)) {
      await this.formatLastVitalsLogJsonData(users, 'lastVitalsOneMonth');
    }
  }

  @Cron('0 0 4 * * *') // At 4:00 everyday
  async buildLastVitalsLogLastTwoMonths(): Promise<void> {
    const users = await this.userService.find({
      where: {
        bodyVitalLogs: {
          createdAt: BetweenTwoMonths as any,
        },
      },
      relations: ['bodyVitalLogs'],
    });
    if (is.notNil(users)) {
      await this.formatLastVitalsLogJsonData(users, 'lastVitalsLogTwoMonths');
    }
  }

  protected async formatLastVitalsLogJsonData(
    users: User[],
    duration: 'lastVitalsOneMonth' | 'lastVitalsLogTwoMonths',
  ) {
    const updateUsers = users.map((user) => {
      const lastBodyVitalsLog = user.bodyVitalLogs.map((bodyVitalsLog) =>
        JSON.parse(bodyVitalsLog.jsonData),
      ) as BodyVitalsLog[];
      const lastBodyVitalsDetails = lastBodyVitalsLog.map(
        (bodyVitalsDetailsLog) => {
          const createdAt = Object.keys(bodyVitalsDetailsLog)[0];
          const bodyVitalsDetailsLogJsonData = {
            [`${createdAt}`]: Object.values(bodyVitalsDetailsLog)[0],
          };
          return bodyVitalsDetailsLogJsonData;
        },
      );
      user[duration] = JSON.stringify({
        lastBodyVitalsLog: lastBodyVitalsDetails,
      });
      return user;
    }, []);
    await this.userService.save(updateUsers);
  }
}
