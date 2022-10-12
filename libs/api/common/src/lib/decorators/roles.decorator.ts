import { SetMetadata } from '@nestjs/common';

import { USER_ROLES } from '../constants';

export type UserRolesType = typeof USER_ROLES[keyof typeof USER_ROLES];
/**
 * Specify user can access for each endpoint.
 *
 * Default: [UserRole.Public].
 *
 * @param {USER_ROLES[]} roles
 *
 */
export const Roles = <UserRolesType>(...roles: UserRolesType[]) =>
  SetMetadata('roles', roles);
