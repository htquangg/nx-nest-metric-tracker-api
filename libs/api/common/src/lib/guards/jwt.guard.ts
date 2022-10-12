import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { JwtPayload } from './interface';
import { StrategyMethod } from '../enums';

@Injectable()
export class JwtAuthGuard extends AuthGuard(StrategyMethod.JWT) {
  /**
   * @param context Current execution context. Provides access to details about
   * the current request pipeline.
   *
   * @returns Return value indicates whether or not the current request is
   * allowed to proceed.
   */
  async canActivate(context: ExecutionContext) {
    await super.canActivate(context);

    const req = context.switchToHttp().getRequest() as Request;
    const user = req['user'] as JwtPayload;

    this.assignParamToRequest(req, user);

    return true;
  }

  assignParamToRequest(req: Request, payload: JwtPayload) {
    req.params['userId'] = payload.userId;
    req.params['email'] = payload.email;
  }
}
