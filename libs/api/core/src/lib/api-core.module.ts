import { Module } from '@nestjs/common';

import { UserModule } from './user';
import { AuthModule } from './auth';
import { MailModule } from './mail';
import { BodyVitalsModule } from './body-vitals';

@Module({
  imports: [MailModule, UserModule, AuthModule, BodyVitalsModule],
})
export class ApiCoreModule {}
