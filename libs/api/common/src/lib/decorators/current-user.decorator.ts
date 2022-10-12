import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { JwtPayload } from '../guards';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest() as Request;
    const { userId, email, isActive } = req['user'] as JwtPayload;
    return { userId, email, isActive };
  },
);
