import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthNotifier } from './auth.notifier';
import { UserModule } from '../user';
import { MailModule } from '../mail';

import { authConfiguration } from '@everfit/api/config';
import { AuthConfig } from '@everfit/api/types';

@Module({
  imports: [
    UserModule,
    MailModule,
    JwtModule.registerAsync({
      inject: [authConfiguration.KEY],
      useFactory: (authConfig: AuthConfig) => ({
        secret: authConfig.jwtSecret,
        signOptions: {
          expiresIn: authConfig.jwtExpired,
        },
      }),
    }),
    EventEmitterModule.forRoot({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthNotifier],
  exports: [AuthService],
})
export class AuthModule {}
