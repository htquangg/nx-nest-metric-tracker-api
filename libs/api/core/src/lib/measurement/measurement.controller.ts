import { Body, Controller, Get, Post } from '@nestjs/common';

import { UpsertBodyVitalsDto } from './dtos';
import { MeasurementService } from './measurement.service';

import {
  AuthUserDto,
  CurrentUser,
  Roles,
  USER_ROLES,
} from '@everfit/api/common';

@Controller('/measurement')
@Roles(USER_ROLES.APP)
export class MeasurementController {
  constructor(private readonly measurementService: MeasurementService) {}

  @Get('/body-vitals')
  async getBodyVitalsLog(@CurrentUser() currentUser: AuthUserDto) {
    return await this.measurementService.getBodyVitalsLog(currentUser);
  }

  @Post('/body-vitals')
  async upsertBodyVitalsLog(
    @CurrentUser() currentUser: AuthUserDto,
    @Body() body: UpsertBodyVitalsDto,
  ) {
    return await this.measurementService.upsertBodyVitalsLog(currentUser, body);
  }
}
