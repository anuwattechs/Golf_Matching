import { Injectable, Logger } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/app/config/config.type';
import { MailTemplateEnum } from 'src/shared/enums';

@Injectable()
export class MailService {
  private readonly ses: AWS.SES;
  private readonly logger = new Logger(MailService.name);
  private readonly sourceEmail: string;

  constructor(private configService: ConfigService<AllConfigType>) {
    this.ses = new AWS.SES({
      region: configService.get<string>('mail.region', { infer: true }),
      accessKeyId: configService.get<string>('mail.accessKeyId', {
        infer: true,
      }),
      secretAccessKey: configService.get<string>('mail.secretAccessKey', {
        infer: true,
      }),
    });
    this.sourceEmail = configService.get<string>('mail.sourceEmail', {
      infer: true,
    });
  }

  async sendVerifyCode(
    email: string,
    data: { code: string },
  ): Promise<boolean> {
    const params: AWS.SES.SendTemplatedEmailRequest = {
      Source: this.sourceEmail,
      Destination: {
        ToAddresses: [email],
      },
      Template: MailTemplateEnum.VERIFY_CODE,
      TemplateData: JSON.stringify(data),
    };

    try {
      await this.ses.sendTemplatedEmail(params).promise();
      return true;
    } catch (error) {
      this.logger.error('Failed to send verification code email', error);
      return false;
    }
  }

  private getVerificationHtmlTemplate(): string {
    return `
      <html>
        <body>
          <p>Hi,</p>
          <p>To verify your email account, please use the code below during the verification process:</p>
          <p><b>{{code}}</b></p>
          <p>Thank you, GoLink Golf</p>
        </body>
      </html>
    `;
  }
}
