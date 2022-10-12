import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  getCurrentUser() {
    // TODO: get current user information
  }

  @Get('/body-vitals')
  async getBodyVitalsLog() {
    return await this.userService.getBodyVitalsLog();
  }

  @Post('/body-vitals')
  async updateBodyVitalsLog() {
    return await this.userService.updateBodyVitalsLog();
  }
}
