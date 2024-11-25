import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MemberModel, VerificationCodesModel } from 'src/schemas/models';
import { SmsService } from 'src/app/common/services/sms/sms.service';
import { UtilsService } from 'src/shared/utils/utils.service';
import {
  RequestOtpDto,
  VerifyOtpDto,
  RequestOtpChangeUsernameDto,
} from './dto';
import { NullableType } from 'src/shared/types';
import { VerifyTypeEnum } from 'src/shared/enums';
import { MailService } from 'src/app/common/services/mail/mail.service';

@Injectable()
export class OtpService {
  constructor(
    private readonly utilsService: UtilsService,
    private readonly memberModel: MemberModel,
    private readonly verificationCodesModel: VerificationCodesModel,
    private readonly smsService: SmsService,
    private readonly mailService: MailService,
  ) {}

  async create(input: RequestOtpDto): Promise<NullableType<unknown>> {
    try {
      //! Check if user registered
      const userRegistered = await this.memberModel.findAllByUsername(
        input.username,
      );

      console.log(userRegistered.length);

      if (userRegistered.length > 0 && input.type === VerifyTypeEnum.REGISTER)
        throw new HttpException(
          this.utilsService.getMessagesTypeSafe('otp.USER_ALREADY_REGISTERED'),
          HttpStatus.BAD_REQUEST,
        );

      if (
        userRegistered.length == 0 &&
        input.type === VerifyTypeEnum.RECOVER_PASSWORD
      )
        throw new HttpException(
          'otp.USER_DOES_NOT_EXISTS',
          HttpStatus.BAD_REQUEST,
        );

      const verifyCode = this.utilsService.generateRandomNumber(6);
      const created = await this.verificationCodesModel.create({
        username: input.username,
        type: input.type,
        verifyCode,
      });

      const isEmail = this.utilsService.validateEmail(input.username);
      const isPhone = this.utilsService.validatePhoneNumber(input.username);

      if (isEmail) {
        const resp =
          input.type === VerifyTypeEnum.REGISTER
            ? await this.mailService.sendVerifyCode(input.username, {
                code: verifyCode,
                referenceCode: created._id.slice(0, 6),
              })
            : await this.mailService.sendRecoveryPassword(input.username, {
                code: verifyCode,
                referenceCode: created._id.slice(0, 6),
              });
        console.log('Email Response: ', resp);
      } else if (isPhone) {
        const resp = await this.smsService.sendSms(input.username, input.type, {
          code: verifyCode,
          referenceCode: created._id.slice(0, 6),
        });
        console.log('SMS Response: ', resp);
      }

      return {
        verifyId: created._id,
        referenceNo: created._id.slice(0, 6),
        verifyCode,
      };
    } catch (error) {
      this.handleException(error);
    }
  }

  async createChangeUsername(
    input: RequestOtpChangeUsernameDto,
  ): Promise<NullableType<unknown>> {
    try {
      //! Check if user registered
      const userRegistered = await this.memberModel.findAllByUsername(
        input.username,
      );

      if (userRegistered.length > 0 && input.type === VerifyTypeEnum.REGISTER)
        throw new HttpException(
          this.utilsService.getMessagesTypeSafe('otp.USER_ALREADY_REGISTERED'),
          HttpStatus.BAD_REQUEST,
        );

      if (
        userRegistered.length == 0 &&
        input.type === VerifyTypeEnum.RECOVER_PASSWORD
      )
        throw new HttpException(
          'otp.USER_DOES_NOT_EXISTS',
          HttpStatus.BAD_REQUEST,
        );

      const verifyCode = this.utilsService.generateRandomNumber(6);
      const created = await this.verificationCodesModel.create({
        username: input.username,
        type: input.type,
        verifyCode,
      });

      const isEmail = this.utilsService.validateEmail(input.username);
      const isPhone = this.utilsService.validatePhoneNumber(input.username);

      //! Send verification code to user (OTP via Email or Phone)
      if (isEmail) {
        const resp =
          input.type === VerifyTypeEnum.REGISTER
            ? await this.mailService.sendVerifyCode(input.username, {
                code: verifyCode,
                referenceCode: created._id.slice(0, 6),
              })
            : await this.mailService.sendRecoveryPassword(input.username, {
                code: verifyCode,
                referenceCode: created._id.slice(0, 6),
              });
        console.log('Email Response: ', resp);
      } else if (isPhone) {
        const resp = await this.smsService.sendSms(input.username, input.type, {
          code: verifyCode,
          referenceCode: created._id.slice(0, 6),
        });
        console.log('SMS Response: ', resp);
      }

      return {
        verifyId: created._id,
        referenceNo: created._id.slice(0, 6),
        verifyCode,
      };
    } catch (error) {
      this.handleException(error);
    }
  }

  async verify(input: VerifyOtpDto): Promise<NullableType<unknown>> {
    try {
      //! Check if registration code is valid
      const validatedResult = await this.verificationCodesModel.validate(
        input.verifyId,
        input.verifyCode,
      );

      if (validatedResult !== null)
        throw new HttpException(validatedResult, HttpStatus.BAD_REQUEST);

      await this.verificationCodesModel.verify(input.verifyId);

      return null;
    } catch (error) {
      this.handleException(error);
    }
  }

  private handleException(error: any): void {
    throw new HttpException(
      {
        status: false,
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        data: null,
      },
      error.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
