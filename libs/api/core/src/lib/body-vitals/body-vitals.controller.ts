import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  HttpServer,
  HttpStatus,
} from '@nestjs/common';

import {
  GetBodyVitalsQueryDto,
  GetBodyVitalsParamsDto,
  UpsertBodyVitalsBodyDto,
  GetBodyVitalsPayload,
  UpsertBodyVitalsPayload,
} from './dtos';
import { BodyVitalsService } from './body-vitals.service';
import { BodyVitalsDetailsService } from './body-vitals-details.service';

import {
  AuthUserDto,
  CurrentUser,
  Roles,
  USER_ROLES,
} from '@everfit/api/common';
import { is } from '@everfit/shared/utils';

@Controller('/measurement')
@Roles(USER_ROLES.APP)
export class BodyVitalsController {
  constructor(
    protected readonly bodyVitalsService: BodyVitalsService,
    protected readonly bodyVitalsDetailsService: BodyVitalsDetailsService,
  ) {}

  @Get('/body-vitals/:bodyVitalsId?')
  async getBodyVitalsLog(
    @CurrentUser() currentUser: AuthUserDto,
    @Param() params?: GetBodyVitalsParamsDto,
    @Query() query?: GetBodyVitalsQueryDto,
  ) {
    const payload: GetBodyVitalsPayload = {
      ...params,
      ...query,
    };
    if (is.notNil(payload) && is.notNil(payload.bodyVitalsId)) {
      return await this.bodyVitalsService.findOneById(
        payload.bodyVitalsId,
        payload,
      );
    }
    return await this.bodyVitalsService.findByUserId(
      currentUser.userId,
      payload,
    );
  }

  @Get('/chart')
  async getChartBodyVitalsLog(
    @CurrentUser() currentUser: AuthUserDto,
    @Query() query?: GetBodyVitalsQueryDto,
  ) {
    const payload: GetBodyVitalsPayload = {
      ...query,
    };
    // if (is.notNil(payload) && is.notNil(payload.bodyVitalsId)) {
    //   return await this.bodyVitalsService.findOneById(
    //     payload.bodyVitalsId,
    //     payload,
    //   );
    // }
    return await this.bodyVitalsService.findLastVitals(
      currentUser.userId,
      payload,
    );
  }

  @Post('/body-vitals')
  async upsertBodyVitalsLog(
    @CurrentUser() currentUser: AuthUserDto,
    @Body() body: UpsertBodyVitalsBodyDto,
  ) {
    // const payload: UpsertBodyVitalsPayload = {
    //   ...body,
    // };
    // await this.bodyVitalsService.upsertByUserId(currentUser.userId, payload);
    return HttpStatus.CREATED;
  }

  @Get('/body-vitals-details/:bodyVitalsDetailsId?')
  async getBodyVitalsLogDetails(
    @CurrentUser() currentUser: AuthUserDto,
    @Param() params?: GetBodyVitalsParamsDto,
    @Query() query?: GetBodyVitalsQueryDto,
  ) {
    const payload: GetBodyVitalsPayload = {
      ...params,
      ...query,
    };
    if (is.notNil(payload) && is.notNil(payload.bodyVitalsDetailsId)) {
      return await this.bodyVitalsDetailsService.findOneById(
        params.bodyVitalsDetailsId,
        payload,
      );
    }
    const bodyVitalLogs = await this.bodyVitalsService.findOneByUserId(
      currentUser.userId,
    );
    return await this.bodyVitalsDetailsService.findByBodyVitalsLogId(
      bodyVitalLogs.id,
      payload,
    );
  }

  @Post('/body-vitals-details')
  async upsertBodyVitalsLogDetails(
    @CurrentUser() currentUser: AuthUserDto,
    @Body() body: UpsertBodyVitalsBodyDto,
  ) {
    const payload: UpsertBodyVitalsPayload = {
      ...body,
    };
    await this.bodyVitalsDetailsService.upsertByUserId(
      currentUser.userId,
      payload,
    );
    return HttpStatus.CREATED;
  }
}
