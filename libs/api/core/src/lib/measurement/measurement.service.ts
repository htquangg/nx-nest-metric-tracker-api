import { Injectable } from '@nestjs/common';

import { BodyVitalsService } from '../body-vitals';

@Injectable()
export class MeasurementService {
  constructor(protected readonly bodyVitalsService: BodyVitalsService) {}

  async getBodyVitalsLog() {}

  async updateBodyVitalsLog() {}
}
