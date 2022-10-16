import { Injectable } from '@nestjs/common';
import AWS from 'aws-sdk';

import { InjectMailConfig } from '@everfit/api/config';
import { MailConfig } from '@everfit/api/types';
import { SendInvitationDto } from './dtos';

@Injectable()
export class MailService {
  private readonly client: AWS.SES;

  private readonly sesFromAddress: string;

  private readonly AWS_SES_TEMPLATE_VERIFICATION = 'EmailVerificationTemplate';

  constructor(@InjectMailConfig() private readonly mailConfig: MailConfig) {
    this.client = new AWS.SES({
      region: this.mailConfig.awsSESRegion,
      credentials: {
        accessKeyId: this.mailConfig.awsSESAccessKeyId,
        secretAccessKey: this.mailConfig.awsSESSecretAccessKey,
      },
      apiVersion: this.mailConfig.awsSESApiVersion,
    });
    this.sesFromAddress = this.mailConfig.awsSESFromAddress;
  }

  async sendInvitation(params: SendInvitationDto): Promise<unknown> {
    const { to, name, urlVerification } = params;

    const msg: AWS.SES.Types.SendTemplatedEmailRequest = {
      Source: this.sesFromAddress,
      Template: this.AWS_SES_TEMPLATE_VERIFICATION,
      Destination: {
        ToAddresses: [to],
      },
      TemplateData: `{"name": "${name}","urlVerification": "${urlVerification}"}`,
    };

    return await this.client.sendTemplatedEmail(msg).promise();
  }
}
