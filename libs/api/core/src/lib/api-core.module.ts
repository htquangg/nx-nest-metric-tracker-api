import { Module } from '@nestjs/common';

import { UserModule } from './user';
import { AuthModule } from './auth';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [MailModule, UserModule, AuthModule],
})
export class ApiCoreModule {}
