import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { REQUEST_ID_TOKEN_HEADER } from '../constants';
import { randomStringGenerator } from '@everfit/shared/utils';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers[REQUEST_ID_TOKEN_HEADER]) {
      req.headers[REQUEST_ID_TOKEN_HEADER] = randomStringGenerator();
    }
    res.setHeader(
      REQUEST_ID_TOKEN_HEADER,
      req.headers[REQUEST_ID_TOKEN_HEADER],
    );
    next();
  }
}
