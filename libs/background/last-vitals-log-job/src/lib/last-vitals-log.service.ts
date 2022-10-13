import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import {
  UserService,
  BodyVitalsService,
  BetweenOneMonth,
  BetweenTwoMonths,
} from '@everfit/api/core';
import { is } from '@everfit/shared/utils';

@Injectable()
export class LastVitalsLogCronJob {
  constructor(
    protected readonly userService: UserService,
    protected readonly bodyVitalsLogService: BodyVitalsService,
  ) {}

  @Cron('0 0 0 * * *') // At 00:00 everyday
  async buildLastVitalsLogLastOneMonth(): Promise<void> {
    const users = await this.userService.find();
    if (is.notNil(users)) {
      users.map(async (user) => {
        const bodyVitalsLogs = await this.bodyVitalsLogService.find({
          where: {
            userId: user.id,
            createdAt: BetweenOneMonth,
          },
        });

        if (is.notNil(bodyVitalsLogs) && !is.empty(bodyVitalsLogs)) {
          // create new payload
          // TOIMPROVE: json builder data
          delete user.lastVitalsLogOneMonth;
          const jsonData = bodyVitalsLogs.reduce((acc, cur) => {
            return [...acc, cur.jsonData];
          }, []);
          await this.userService.save({
            ...user,
            lastVitalsLogOneMonth: JSON.stringify(jsonData),
          });
        }
      });
    }
  }

  @Cron('0 0 2 * * *') // At 2:00 everyday
  async buildLastVitalsLogLastTwoMonths(): Promise<void> {
    const users = await this.userService.find();
    if (is.notNil(users)) {
      users.map(async (user) => {
        const bodyVitalsLogs = await this.bodyVitalsLogService.find({
          where: {
            userId: user.id,
            createdAt: BetweenTwoMonths,
          },
        });

        if (is.notNil(bodyVitalsLogs) && !is.empty(bodyVitalsLogs)) {
          // create new payload
          // TOIMPROVE: json builder data
          delete user.lastVitalsLogTwoMonths;
          const jsonData = bodyVitalsLogs.reduce((acc, cur) => {
            return [...acc, cur.jsonData];
          }, []);
          await this.userService.save({
            ...user,
            lastVitalsLogTwoMonths: JSON.stringify(jsonData),
          });
        }
      });
    }
  }
}
