import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import {
  SignUpDto,
  SignInDto,
  VerificationEmailDto,
  VerificationEmailQueryDto,
} from './dto';
import { AuthService } from './auth.service';

import { EmailThrottlerGuard } from '@everfit/api/common';

const THROTTLER_TTL_RESEND_VERIFICATION_EMAIL = 60 * 60 * 24; // one day
const THROTTLER_LIMIT_RESEND_VERIFICATION_EMAIL = 2;

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-up')
  async signUp(@Body() body: SignUpDto) {
    return await this.authService.signUp(body);
  }

  @Post('/sign-in')
  async signIn(@Body() body: SignInDto) {
    return await this.authService.signIn(body);
  }

  @Throttle(
    THROTTLER_LIMIT_RESEND_VERIFICATION_EMAIL,
    THROTTLER_TTL_RESEND_VERIFICATION_EMAIL,
  )
  @UseGuards(EmailThrottlerGuard)
  @Post('/resend-verification-email')
  async resendVerificationEmail(@Body() body: VerificationEmailDto) {
    return await this.authService.resendVerificationEmail(body);
  }

  @Get('/verification-email')
  async verifyEmail(@Query() query: VerificationEmailQueryDto) {
    return await this.authService.verifyEmail(query);
  }

  @Put('/deactivate')
  async deactivateEmail(@Query() query: VerificationEmailQueryDto) {
    return await this.authService.deactiavateEmail(query);
  }
}
