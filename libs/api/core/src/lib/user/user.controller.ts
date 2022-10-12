import { Controller, Get, Post } from '@nestjs/common';

import { UserService } from './user.service';

import {
  AuthUserDto,
  CurrentUser,
  Roles,
  USER_ROLES,
} from '@everfit/api/common';
import { User } from '@everfit/api/entities';

@Controller('/user')
@Roles(USER_ROLES.APP)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  async getCurrentUser(@CurrentUser() currentUser: AuthUserDto): Promise<User> {
    return await this.userService.getUserInformation(currentUser);
  }
}
