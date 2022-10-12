import { AuthUserDto } from '@everfit/api/common';
import { Injectable } from '@nestjs/common';

import { BodyVitalsService } from '../body-vitals';

@Injectable()
export class MeasurementService {
  constructor(protected readonly bodyVitalsService: BodyVitalsService) {}

  async getBodyVitalsLog(currentUser: AuthUserDto) {
    return await this.bodyVitalsService.getDetailBodyVitals(currentUser.userId);
  }

  async updateBodyVitalsLog() {}
}
