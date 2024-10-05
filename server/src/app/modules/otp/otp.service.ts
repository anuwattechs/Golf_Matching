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
import { AuthTypeEnum, VerifyTypeEnum } from 'src/shared/enums';

@Injectable()
export class OtpService {
  constructor(
    private readonly utilsService: UtilsService,
    private readonly memberModel: MemberModel,
    private readonly verificationCodesModel: VerificationCodesModel,
    private readonly smsService: SmsService,
  ) {}

  async create(input: RequestOtpDto): Promise<NullableType<unknown>> {
    try {
      //! Check if user registered
      const userRegistered = await this.memberModel.findAllByUsername(
        input.username,
      );

      if (userRegistered.length > 0 && input.type === VerifyTypeEnum.REGISTER)
        throw new HttpException(
          'User already registered',
          HttpStatus.BAD_REQUEST,
        );

      if (
        userRegistered.length == 0 &&
        input.type === VerifyTypeEnum.RECOVER_PASSWORD
      )
        throw new HttpException(
          'User already registered',
          HttpStatus.BAD_REQUEST,
        );

      const verifyCode = this.utilsService.generateRandomNumber(6);
      const created = await this.verificationCodesModel.create({
        username: input.username,
        authType: input.authType,
        type: input.type,
        verifyCode,
      });

      //! Send verification code to user (OTP via Email or Phone)
      if (input.authType === AuthTypeEnum.PHONE) {
        // const resp1 = await this.smsService.sendSms(
        //   input.email,
        //   `Your verification code is ${verifyCode}`,
        // );
        // console.log('SMS Response: ', resp1);
      } else if (input.authType === AuthTypeEnum.EMAIL) {
      }

      return {
          verifyId: created._id,
          referenceNo: created._id.slice(0, 6),
          verifyCode,
        };
    } catch (error) {
      // throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      throw new HttpException(
        {
          status: false,
          statusCode: error.status,
          message: error.message,
          data: null,
        },
        error.status,
      );
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
          'User already registered',
          HttpStatus.BAD_REQUEST,
        );

      if (
        userRegistered.length == 0 &&
        input.type === VerifyTypeEnum.RECOVER_PASSWORD
      )
        throw new HttpException(
          'User already registered',
          HttpStatus.BAD_REQUEST,
        );

      const verifyCode = this.utilsService.generateRandomNumber(6);
      const created = await this.verificationCodesModel.create({
        username: input.username,
        authType: input.authType,
        type: input.type,
        verifyCode,
      });

      //! Send verification code to user (OTP via Email or Phone)
      if (input.authType === AuthTypeEnum.PHONE) {
        // const resp1 = await this.smsService.sendSms(
        //   input.email,
        //   `Your verification code is ${verifyCode}`,
        // );
        // console.log('SMS Response: ', resp1);
      } else if (input.authType === AuthTypeEnum.EMAIL) {
      }

      return {
          verifyId: created._id,
          referenceNo: created._id.slice(0, 6),
          verifyCode,
        };
    } catch (error) {
      // throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      throw new HttpException(
        {
          status: false,
          statusCode: error.status,
          message: error.message,
          data: null,
        },
        error.status,
      );
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
      // throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      throw new HttpException(
        {
          status: false,
          statusCode: error.status,
          message: error.message,
          data: null,
        },
        error.status,
      );
    }
  }
}
