import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ResponseType } from 'src/shared/types';
import * as bcrypt from 'bcrypt';
import { VerificationRegisterDto, VerifyOptDto, RegisterDto } from './dto';
import {
  MemberModel,
  VerificationRegistrationModel,
  VerificationResetPasswordModel,
} from 'src/schemas/models';
import { Utils } from 'src/shared/utils/utils';

@Injectable()
export class AuthService {
  constructor(
    private utils: Utils,
    private memberModel: MemberModel,
    private verificationRegistrationModel: VerificationRegistrationModel,
    private verificationResetPasswordModel: VerificationResetPasswordModel,
  ) {}

  async createVerificationRegister(
    input: VerificationRegisterDto,
  ): Promise<ResponseType<any[]>> {
    try {
      //! Check if user registered
      const userRegistered = await this.memberModel.findAllByEmailOrPhone(
        input.email,
      );

      if (userRegistered.length > 0)
        throw new HttpException(
          'User already registered',
          HttpStatus.BAD_REQUEST,
        );

      //! Check if user exists
      const user =
        await this.verificationRegistrationModel.findOneByEmailOrPhone(
          input.email.toLowerCase(),
        );

      const verifyCode = this.utils.generateRandomNumber(6);
      if (!user) {
        await this.verificationRegistrationModel.create({
          email: input.email.toLowerCase(),
          provider: input.provider,
          verifyCode,
        });
      } else {
        await this.verificationRegistrationModel.updateOne({
          email: input.email.toLowerCase(),
          verifyCode,
          isVerified: false,
          sentCount: user.sentCount + 1,
        });
      }

      //! Send verification code to user (OTP via Email or Phone)

      return {
        status: true,
        statusCode: HttpStatus.CREATED,
        message: 'Verification code sent successfully',
        data: [{ verify_code: verifyCode }],
      };
    } catch (error) {
      //  return {
      //    status: 'error',
      //    statusCode: 500,
      //    message: error.message,
      //    data: [],
      //  };
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyRegister(input: VerifyOptDto): Promise<ResponseType<any[]>> {
    try {
      //! Check if user identity verified
      const userRegistered =
        await this.verificationRegistrationModel.findOneByEmailOrPhone(
          input.email.toLowerCase(),
        );

      if (!userRegistered)
        throw new HttpException('User not registered', HttpStatus.BAD_REQUEST);

      if (userRegistered.verifyCode !== input.verifyCode)
        throw new HttpException(
          'Invalid verification code',
          HttpStatus.BAD_REQUEST,
        );

      //! Check if user exists
      await this.verificationRegistrationModel.verify(
        input.email.toLowerCase(),
      );

      return {
        status: true,
        statusCode: HttpStatus.CREATED,
        message: 'Indentity verified successfully',
        data: [],
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async register(input: RegisterDto): Promise<ResponseType<any[]>> {
    try {
      //! Check if user identity verified
      const userIdentityVerified =
        await this.verificationRegistrationModel.findOneByEmailOrPhone(
          input.email.toLowerCase(),
          true,
        );

      if (!userIdentityVerified)
        throw new HttpException('User not verified', HttpStatus.BAD_REQUEST);

      //! Check if user registered
      const userRegistered = await this.memberModel.findAllByEmailOrPhone(
        input.email.toLowerCase(),
      );

      if (userRegistered.length > 0)
        throw new HttpException(
          'User already registered',
          HttpStatus.BAD_REQUEST,
        );

      const hashedPassword = await bcrypt.hash(input.password, 10);

      /*const created = */ await this.memberModel.create({
        ...input,
        email: input.email.toLowerCase(),
        password: hashedPassword,
      });

      return {
        status: true,
        statusCode: HttpStatus.CREATED,
        message: 'User registered successfully',
        data: [],
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
