import { Controller, Get, Post } from '@nestjs/common';

import { MeasurementService } from './measurement.service';

import { Roles, USER_ROLES } from '@everfit/api/common';

@Controller('/measurement')
@Roles(USER_ROLES.APP)
export class MeasurementController {
  constructor(private readonly measurementService: MeasurementService) {}

  @Get('/body-vitals')
  async getBodyVitalsLog() {
    return await this.measurementService.getBodyVitalsLog();
  }

  @Post('/body-vitals')
  async updateBodyVitalsLog() {
    return await this.measurementService.updateBodyVitalsLog();
  }
}
