import { Injectable } from '@nestjs/common';

import { UpsertBodyVitalsDto } from './dtos';
import { BodyVitalsService } from '../body-vitals';

import { AuthUserDto } from '@everfit/api/common';

@Injectable()
export class MeasurementService {
  constructor(protected readonly bodyVitalsService: BodyVitalsService) {}

  async getBodyVitalsLog(currentUser: AuthUserDto) {
    return await this.bodyVitalsService.getDetailBodyVitals(currentUser.userId);
  }

  async upsertBodyVitalsLog(
    currentUser: AuthUserDto,
    data: UpsertBodyVitalsDto,
  ) {
    return await this.bodyVitalsService.upsertDetailBodyVitals(
      currentUser.userId,
      data,
    );
  }
}
