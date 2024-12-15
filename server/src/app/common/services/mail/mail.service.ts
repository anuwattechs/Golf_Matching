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

  constructor(private readonly configService: ConfigService<AllConfigType>) {
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

  /**
   * Sends a verification code to the specified email address.
   * @param email - The recipient's email address.
   * @param data - An object containing the verification code.
   */
  async sendVerifyCode(
    email: string,
    data: {
      code: string;
      referenceCode: string;
    },
  ): Promise<boolean> {
    return this.sendTemplateEmail(email, MailTemplateEnum.VERIFY_CODE, data);
  }

  /**
   * Sends a password recovery email to the specified email address.
   * @param email - The recipient's email address.
   * @param data - An object containing the reset link.
   */
  async sendRecoveryPassword(
    email: string,
    data: {
      code: string;
      referenceCode: string;
    },
  ): Promise<boolean> {
    return this.sendTemplateEmail(
      email,
      MailTemplateEnum.RECOVER_PASSWORD,
      data,
    );
  }

  /**
   * Sends a password recovery email to the specified email address.
   * @param email - The recipient's email address.
   * @param data - An object containing the reset link.
   */
  async sendAddEmail(
    email: string,
    data: {
      code: string;
      referenceCode: string;
    },
  ): Promise<boolean> {
    return this.sendTemplateEmail(email, MailTemplateEnum.ADD_EMAIL, data);
  }

  /**
   * Sends a password recovery email to the specified email address.
   * @param email - The recipient's email address.
   * @param data - An object containing the reset link.
   */
  async sendChangeEmail(
    email: string,
    data: {
      code: string;
      referenceCode: string;
    },
  ): Promise<boolean> {
    return this.sendTemplateEmail(email, MailTemplateEnum.CHANGE_EMAIL, data);
  }

  /**
   * Generic function to send templated emails.
   * @param email - The recipient's email address.
   * @param template - The email template name.
   * @param data - Data to populate the template.
   */
  private async sendTemplateEmail(
    email: string,
    template: MailTemplateEnum,
    data: object,
  ): Promise<boolean> {
    const params: AWS.SES.SendTemplatedEmailRequest = {
      Source: this.sourceEmail,
      Destination: { ToAddresses: [email] },
      Template: template,
      TemplateData: JSON.stringify(data),
    };

    try {
      await this.ses.sendTemplatedEmail(params).promise();
      return true;
    } catch (error) {
      this.logger.error(`Failed to send ${template} email to ${email}`, error);
      return false;
    }
  }

  /**
   * Initializes the email templates in SES, creating or updating them as necessary.
   */
  initializeTemplates() {
    this.createOrUpdateTemplate(
      MailTemplateEnum.VERIFY_CODE,
      `
      <html>
        <body>
          <p>Hi,</p>
          <p>Thank you for registering with GoLink Golf! To verify your email, please use the following code:</p>
          <p><b>{{code}}</b></p>
          <p>Your reference code for this request is: <b>{{referenceCode}}</b></p>
          <p>If you did not request this verification, please ignore this email.</p>
          <p>Thank you,<br/>GoLink Golf Team</p>
        </body>
      </html>`,
      'GoLink Golf | Email Verification',
    );

    this.createOrUpdateTemplate(
      MailTemplateEnum.RECOVER_PASSWORD,
      `
      <html>
        <body>
          <p>Hi,</p>
          <p>We received a request to reset your password. Please use the following code to proceed:</p>
          <p><b>{{code}}</b></p>
          <p>Your reference code for this request is: <b>{{referenceCode}}</b></p>
          <p>If you did not request a password reset, please secure your account and ignore this message.</p>
          <p>Thank you,<br/>GoLink Golf Team</p>
        </body>
      </html>`,
      'GoLink Golf | Password Recovery',
    );

    this.createOrUpdateTemplate(
      MailTemplateEnum.ADD_EMAIL,
      `
      <html>
        <body>
          <p>Hi,</p>
          <p>We received a request to add your email. Please use the following code to proceed:</p>
          <p><b>{{code}}</b></p>
          <p>Your reference code for this request is: <b>{{referenceCode}}</b></p>
          <p>If you did not request this, please ignore this email or contact our support team immediately.</p>
          <p>Thank you,<br/>GoLink Golf Team</p>
        </body>
      </html>`,
      'GoLink Golf | Add Email',
    );

    this.createOrUpdateTemplate(
      MailTemplateEnum.CHANGE_EMAIL,
      `
      <html>
        <body>
          <p>Hi,</p>
          <p>We received a request to change your email. Please use the following code to proceed:</p>
          <p><b>{{code}}</b></p>
          <p>Your reference code for this request is: <b>{{referenceCode}}</b></p>
          <p>If you did not request this, please ignore this email or contact our support team immediately.</p>
          <p>Thank you,<br/>GoLink Golf Team</p>
        </body>
      </html>`,
      'GoLink Golf | Change Email',
    );
  }

  /**
   * Creates or updates an email template in SES.
   * @param templateName - The name of the email template.
   * @param htmlPart - The HTML content of the email template.
   * @param subjectPart - The subject line of the email template.
   */
  private createOrUpdateTemplate(
    templateName: MailTemplateEnum,
    htmlPart: string,
    subjectPart: string,
  ) {
    const templateParams: AWS.SES.CreateTemplateRequest = {
      Template: {
        TemplateName: templateName,
        HtmlPart: htmlPart,
        SubjectPart: subjectPart,
      },
    };

    this.ses.createTemplate(templateParams, (error, data) => {
      if (error) {
        this.logger.warn(`Template ${templateName} exists, updating instead.`);
        this.updateTemplate(templateParams);
      } else {
        this.logger.log(`Template ${templateName} created successfully.`);
      }
    });
  }

  /**
   * Updates an existing SES template.
   * @param templateParams - The parameters for the email template.
   */
  private updateTemplate(templateParams: AWS.SES.UpdateTemplateRequest) {
    this.ses.updateTemplate(templateParams, (error, data) => {
      if (error) {
        this.logger.error('Error updating template:', error);
      } else {
        this.logger.log(
          `Template updated successfully: ${templateParams.Template.TemplateName}`,
        );
      }
    });
  }
}
