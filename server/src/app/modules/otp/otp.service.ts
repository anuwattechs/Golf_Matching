import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MemberModel, VerificationCodesModel } from 'src/schemas/models';
import { SmsService } from 'src/app/common/services/sms/sms.service';
import { UtilsService } from 'src/shared/utils/utils.service';
import {
  RequestOtpDto,
  RequestOtpAuthDto,
  VerifyOtpDto,
  RequestOtpChangeUsernameDto,
} from './dto';
import { NullableType } from 'src/shared/types';
import { VerifyTypeEnum, VerifyTypeAuthEnum } from 'src/shared/enums';
import { MailService } from 'src/app/common/services/mail/mail.service';
import { JwtPayloadType } from '../auth/strategies/types';

@Injectable()
export class OtpService {
  constructor(
    private readonly utilsService: UtilsService,
    private readonly memberModel: MemberModel,
    private readonly verificationCodesModel: VerificationCodesModel,
    private readonly smsService: SmsService,
    private readonly mailService: MailService,
  ) {}

  async initMailTemplate(): Promise<NullableType<unknown>> {
    try {
      this.mailService.initializeTemplates();

      return null;
    } catch (error) {
      this.handleException(error);
    }
  }

  async create(input: RequestOtpDto): Promise<NullableType<unknown>> {
    try {
      //! Check if user registered
      const userRegistered = await this.memberModel.findAllByUsername(
        input.username,
      );

      // console.log(userRegistered.length);

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

      const isEmail = this.utilsService.validateEmail(input.username);
      const isPhone = this.utilsService.validatePhoneNumber(input.username);

      if (!isEmail && !isPhone)
        throw new HttpException(
          this.utilsService.getMessagesTypeSafe('otp.INVALID_EMAIL_OR_PHONE'),
          HttpStatus.BAD_REQUEST,
        );

      const verifyCode = this.utilsService.generateRandomNumber(6);
      const created = await this.verificationCodesModel.create({
        username: input.username,
        verifyType: input.type,
        verifyCode,
      });

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

  async createByAuth(
    input: RequestOtpAuthDto,
    decoded: JwtPayloadType,
  ): Promise<NullableType<unknown>> {
    try {
      // return {
      //   input,
      //   decoded,
      // };

      //! Check if user registered
      const userRegistered = await this.memberModel.findById(decoded.userId);
      const userRegistered2 = await this.memberModel.findAllByUsername(
        input.username.toLowerCase(),
      );

      // console.log(userRegistered2);

      if (userRegistered2.length > 0)
        throw new HttpException(
          this.utilsService.getMessagesTypeSafe('auth.USER_ALREADY_REGISTERED'),
          HttpStatus.BAD_REQUEST,
        );

      // console.log(userRegistered.length);

      // return userRegistered.toObject();

      if (!userRegistered)
        throw new HttpException(
          this.utilsService.getMessagesTypeSafe('auth.USER_NOT_REGISTERED'),
          HttpStatus.BAD_REQUEST,
        );

      if (
        userRegistered.facebookId ||
        userRegistered.googleId ||
        userRegistered.appleId
      )
        throw new HttpException(
          this.utilsService.getMessagesTypeSafe('auth.USER_SOCIAL_ACCOUNT'),
          HttpStatus.BAD_REQUEST,
        );

      const isEmail = this.utilsService.validateEmail(input.username);
      const isPhone = this.utilsService.validatePhoneNumber(input.username);
      if (!isEmail && !isPhone)
        throw new HttpException(
          this.utilsService.getMessagesTypeSafe('otp.INVALID_EMAIL_OR_PHONE'),
          HttpStatus.BAD_REQUEST,
        );

      if (
        (isEmail &&
          (input.type === VerifyTypeAuthEnum.ADD_PHONE_NUMBER ||
            input.type === VerifyTypeAuthEnum.CHANGE_PHONE_NUMBER)) ||
        (isPhone &&
          (input.type === VerifyTypeAuthEnum.ADD_EMAIL ||
            input.type === VerifyTypeAuthEnum.CHANGE_EMAIL)) ||
        (input.type === VerifyTypeAuthEnum.ADD_EMAIL &&
          userRegistered.email !== null) ||
        (input.type === VerifyTypeAuthEnum.ADD_PHONE_NUMBER &&
          userRegistered.phoneNo !== null) ||
        (input.type === VerifyTypeAuthEnum.CHANGE_EMAIL &&
          userRegistered.email === null) ||
        (input.type === VerifyTypeAuthEnum.CHANGE_PHONE_NUMBER &&
          userRegistered.phoneNo === null)
      )
        throw new HttpException(
          this.utilsService.getMessagesTypeSafe('status-code.400'),
          HttpStatus.BAD_REQUEST,
        );

      // return null;

      const verifyCode = this.utilsService.generateRandomNumber(6);
      const created = await this.verificationCodesModel.create({
        username: input.username,
        verifyType: input.type,
        verifyCode,
      });

      const referenceCode = created._id.slice(0, 6);

      if (isEmail) {
        const resp =
          input.type === VerifyTypeAuthEnum.ADD_EMAIL
            ? await this.mailService.sendAddEmail(input.username, {
                code: verifyCode,
                referenceCode,
              })
            : await this.mailService.sendChangeEmail(input.username, {
                code: verifyCode,
                referenceCode,
              });
        // console.log('Email Response: ', resp);
      } else if (isPhone) {
        const resp = await this.smsService.sendSms(input.username, input.type, {
          code: verifyCode,
          referenceCode,
        });
        // console.log('SMS Response: ', resp);
      }

      return {
        verifyId: created._id,
        referenceNo: referenceCode,
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
        verifyType: input.type,
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

  async verifyChangeContact(
    input: VerifyOtpDto,
    decoded: JwtPayloadType,
  ): Promise<NullableType<unknown>> {
    try {
      //! Check if registration code is valid
      const validatedResult = await this.verificationCodesModel.validate(
        input.verifyId,
        input.verifyCode,
      );

      if (validatedResult !== null)
        throw new HttpException(validatedResult, HttpStatus.BAD_REQUEST);

      const updated = await this.verificationCodesModel.verify(input.verifyId);
      if (updated.modifiedCount === 0)
        throw new HttpException(
          this.utilsService.getMessagesTypeSafe(
            'otp.VERIFICATION_CODE_IS_INVALID',
          ),
          HttpStatus.BAD_REQUEST,
        );

      //! Check if user verified
      const userVerified = await this.verificationCodesModel.findById(
        input.verifyId,
        [true],
      );
      if (!userVerified)
        throw new HttpException(
          this.utilsService.getMessagesTypeSafe('auth.USER_NOT_VERIFIED'),
          HttpStatus.BAD_REQUEST,
        );
      if (
        ![
          VerifyTypeAuthEnum.ADD_EMAIL,
          VerifyTypeAuthEnum.ADD_PHONE_NUMBER,
          VerifyTypeAuthEnum.CHANGE_EMAIL,
          VerifyTypeAuthEnum.CHANGE_PHONE_NUMBER,
        ].includes(userVerified.verifyType as VerifyTypeAuthEnum)
      )
        throw new HttpException(
          this.utilsService.getMessagesTypeSafe('auth.INVALID_VERIFY_TYPE'),
          HttpStatus.BAD_REQUEST,
        );

      const isEmail = this.utilsService.validateEmail(userVerified.username);
      const isPhoneNo = this.utilsService.validatePhoneNumber(
        userVerified.username,
      );

      if (!(isEmail || isPhoneNo))
        throw new HttpException(
          this.utilsService.getMessagesTypeSafe('otp.INVALID_EMAIL_OR_PHONE'),
          HttpStatus.BAD_REQUEST,
        );

      if (isEmail) {
        await this.memberModel.updateEmailById(
          decoded.userId,
          userVerified.username,
        );
      } else if (isPhoneNo) {
        await this.memberModel.updatePhoneNoById(
          decoded.userId,
          userVerified.username,
        );
      }

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
