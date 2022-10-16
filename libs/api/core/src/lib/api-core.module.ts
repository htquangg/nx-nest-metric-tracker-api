import { Module } from '@nestjs/common';

import { UserModule } from './user';
import { AuthModule } from './auth';
import { MailModule } from './mail';
import { BodyVitalsModule } from './body-vitals';
import { ExchangeRateModule } from './exchange-rate';
import { MeasurementUnitModule } from './measurement-unit';

@Module({
  imports: [
    MailModule,
    UserModule,
    AuthModule,
    BodyVitalsModule,
    ExchangeRateModule,
    MeasurementUnitModule,
  ],
})
export class ApiCoreModule {}
