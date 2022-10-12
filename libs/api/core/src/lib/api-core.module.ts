import { Module } from '@nestjs/common';

import { UserModule } from './user';
import { AuthModule } from './auth';
import { MailModule } from './mail';
import { BodyVitalsModule } from './body-vitals';
import { MeasurementModule } from './measurement';

@Module({
  imports: [
    MailModule,
    UserModule,
    AuthModule,
    BodyVitalsModule,
    MeasurementModule,
  ],
})
export class ApiCoreModule {}
