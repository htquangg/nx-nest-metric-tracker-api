import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Between, In } from 'typeorm';

import {
  UserService,
  BodyVitalsService,
  BetweenOneMonth,
  BetweenTwoMonths,
  startLastTwoMonths,
  endLastOneMonth,
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
    const users = await this.userService.find({
      where: { bodyVitalLogs: { createdAt: BetweenOneMonth as any } },
      relations: ['bodyVitalLogs'],
    });
    if (is.notNil(users)) {
      const updateUsers = users.map((user) => {
        const lastVitalsLogOneMonth = user.bodyVitalLogs.map((bodyVitalsLog) =>
          JSON.parse(bodyVitalsLog.jsonData),
        );
        user.lastVitalsLogOneMonth = JSON.stringify(lastVitalsLogOneMonth);
        return user;
      }, []);
      await this.userService.save(updateUsers);
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
      const updateUsers = users.map((user) => {
        const lastVitalsLogTwoMonths = user.bodyVitalLogs.map((bodyVitalsLog) =>
          JSON.parse(bodyVitalsLog.jsonData),
        );
        user.lastVitalsLogTwoMonths = JSON.stringify(lastVitalsLogTwoMonths);
        return user;
      }, []);
      await this.userService.save(updateUsers);
    }
  }
}
