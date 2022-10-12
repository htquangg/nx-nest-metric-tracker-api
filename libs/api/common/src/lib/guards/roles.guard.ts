import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

import { USER_ROLES } from '../constants';
import { StrategyMethod } from '../enums';
import { UserRolesType } from '../decorators';

import { is } from '@everfit/shared/utils';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndOverride<UserRolesType[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    return this.nextOrThrowError(context, roles);
  }

  async nextOrThrowError(context: ExecutionContext, roles: UserRolesType[]) {
    const hasRoles = (roles: unknown) => is.nil(roles) || is.empty(roles);

    if (hasRoles(roles)) {
      return false;
    }

    const validates = await Promise.all(
      roles.map(async (role) => {
        if (role.includes(USER_ROLES.PUBLIC)) {
          return true;
        }
        if (role.includes(USER_ROLES.APP)) {
          return new (AuthGuard(StrategyMethod.JWT))().canActivate(context);
        }
      }),
    );

    return validates.some((validate) => validate);
  }
}
