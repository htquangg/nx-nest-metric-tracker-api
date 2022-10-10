import { Module } from '@nestjs/common';

import { BackgroundMailJobModule } from '@everfit/background/mail-job';

const backgroundModules = [BackgroundMailJobModule];

@Module({
  imports: [...backgroundModules],
})
export class BackgroundModule {}
