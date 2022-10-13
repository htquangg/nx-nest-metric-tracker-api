import { Module } from '@nestjs/common';

import { BackgroundMailJobModule } from '@everfit/background/mail-job';
import { BackgroundLastVitalsLogJobModule } from '@everfit/background/last-vitals-log-job';

const backgroundModules = [
  BackgroundMailJobModule,
  BackgroundLastVitalsLogJobModule,
];

@Module({
  imports: [...backgroundModules],
})
export class BackgroundModule {}
