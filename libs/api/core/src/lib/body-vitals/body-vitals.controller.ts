import { Body, Controller, Get, Post } from '@nestjs/common';

import { GetBodyVitalsDto, UpsertBodyVitalsDto } from './dtos';
import { BodyVitalsService } from './body-vitals.service';

import {
  AuthUserDto,
  CurrentUser,
  Roles,
  USER_ROLES,
} from '@everfit/api/common';

@Controller('/measurement')
@Roles(USER_ROLES.APP)
export class BodyVitalsController {
  constructor(protected readonly bodyVitalsService: BodyVitalsService) {}

  @Get('/body-vitals')
  async getBodyVitalsLog(
    @CurrentUser() currentUser: AuthUserDto,
    @Body() body?: GetBodyVitalsDto,
  ) {
    return await this.bodyVitalsService.getBodyVitalsLog(currentUser, body);
  }

  @Post('/body-vitals')
  async upsertBodyVitalsLog(
    @CurrentUser() currentUser: AuthUserDto,
    @Body() body: UpsertBodyVitalsDto,
  ) {
    return await this.bodyVitalsService.upsertBodyVitalsLog(currentUser, body);
  }
}
