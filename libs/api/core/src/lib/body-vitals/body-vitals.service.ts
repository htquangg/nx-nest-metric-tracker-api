import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { startOfDay, endOfDay } from 'date-fns';

import { EverfitBaseService } from '@everfit/api/common';
import { BodyVitalsLog, BodyVitalsLogProps } from '@everfit/api/entities';
import { is, randomStringGenerator } from '@everfit/shared/utils';

@Injectable()
export class BodyVitalsService extends EverfitBaseService<BodyVitalsLog> {
  constructor(
    @InjectRepository(BodyVitalsLog)
    protected readonly repository: Repository<BodyVitalsLog>,
  ) {
    super(repository);
  }

  async getDetailBodyVitals(userId: string): Promise<BodyVitalsLog> {
    const bodyVitalsLog = await this.repository.findOne({
      where: {
        userId,
        createdAt: Between(startOfDay(Date.now()), endOfDay(Date.now())),
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
}
