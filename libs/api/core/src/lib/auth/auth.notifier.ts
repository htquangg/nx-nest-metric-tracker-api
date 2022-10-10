import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bull';

import { mailQueueName, EmailJob } from '@everfit/background/common';
import { User } from '@everfit/api/entities';
import { AuthEvents } from './constants';

@Injectable()
export class AuthNotifier {
  constructor(@InjectQueue(mailQueueName) private readonly mailQueue: Queue) {}

  @OnEvent(AuthEvents.NewUser)
  onNewUser(data: User) {
    return this.mailQueue.add(EmailJob.SendEmailVerification, data);
  }

  @OnEvent(AuthEvents.VerifyUser)
  onVerifyUser(data: User) {
    return this.mailQueue.add(EmailJob.SendEmailVerification, data);
  }
}
