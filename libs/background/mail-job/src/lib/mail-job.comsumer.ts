import { Logger } from '@nestjs/common';
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

import { ERROR_MESSAGES } from './constants';

import { MailService } from '@everfit/api/core';
import { EmailJob, mailQueueName } from '@everfit/background/common';
import { User } from '@everfit/api/entities';
import { InjectAppConfig } from '@everfit/api/config';
import { AppConfig } from '@everfit/api/types';

@Processor(mailQueueName)
export class MailJobConsumer {
  private readonly logger = new Logger(MailJobConsumer.name);

  constructor(
    @InjectAppConfig() private readonly appConfig: AppConfig,
    private readonly mailService: MailService,
  ) {}

  @Process(EmailJob.SendEmailVerification)
  async sendEmailVerification(job: Job<User>) {
    const { email, firstName, lastName } = job.data;
    // fake url
    const url = `${this.appConfig.clientDomain}/api/v1/auth/verification-email?email=${email}&signToken=signToken`;

    try {
      return await this.mailService.sendInvitation({
        name: `${firstName} ${lastName}`,
        to: email,
        urlVerification: url,
      });
    } catch (error) {
      this.logger.error(ERROR_MESSAGES.VERIFICATION_EMAIL, error);
    }
  }
}
