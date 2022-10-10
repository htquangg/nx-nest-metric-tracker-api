import { Module, Global } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

import { MailJobConsumer } from './mail-job.comsumer';

import { redisConfiguration } from '@everfit/api/config';
import { MailModule } from '@everfit/api/core';
import {
  mailQueueName,
  queueProviderFactory,
} from '@everfit/background/common';

@Global()
@Module({
  imports: [
    BullModule.registerQueueAsync({
      inject: [redisConfiguration.KEY],
      name: mailQueueName,
      useFactory: queueProviderFactory(mailQueueName),
    }),
    MailModule,
  ],
  providers: [MailJobConsumer],
  exports: [BullModule],
})
export class BackgroundMailJobModule {}
