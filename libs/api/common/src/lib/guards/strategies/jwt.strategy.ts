import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';

import { JwtPayload } from '../interface';
import { StrategyMethod } from '../../enums';

import { InjectAuthConfig } from '@everfit/api/config';
import { AuthConfig } from '@everfit/api/types';

@Injectable()
export class JwtStrategyService extends PassportStrategy(
  Strategy,
  StrategyMethod.JWT,
) {
  constructor(@InjectAuthConfig() readonly authConfig: AuthConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: authConfig.jwtSecret,
    });
  }

  validate(payload: JwtPayload, _done: VerifiedCallback): JwtPayload {
    return payload;
  }
}
