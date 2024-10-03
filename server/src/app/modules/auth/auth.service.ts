import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { LoginResponseType, NullableType } from 'src/shared/types';
import { SocialInterface } from 'src/shared/interfaces';
import * as bcrypt from 'bcrypt';
import {
  VerificationRegisterDto,
  VerifyOtpDto,
  VerifyOtpResetPasswordDto,
  RegisterDto,
  LoginDto,
  ChangePasswordDto,
  ResetPasswordDto,
} from './dto';
import {
  MemberModel,
  VerificationRegistrationModel,
  VerificationResetPasswordModel,
} from 'src/schemas/models';
import { UtilsService } from 'src/shared/utils/utils.service';
import { JwtService } from '@nestjs/jwt';
import { AuthTypeEnum } from 'src/shared/enums';
import { JwtPayloadType } from './strategy/jwt-payload.type';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/app/config/config.type';
import { SmsService } from 'src/app/common/services/sms/sms.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly utilsService: UtilsService,
    private readonly memberModel: MemberModel,
    private readonly verificationRegistrationModel: VerificationRegistrationModel,
    private readonly verificationResetPasswordModel: VerificationResetPasswordModel,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly smsService: SmsService,
  ) {}

  private generateToken(payload: JwtPayloadType): string {
    return this.jwtService.sign(payload);
  }

  validateToken(token: string): JwtPayloadType {
    return this.jwtService.verify(token);
  }

  private convertTimeStringToMs(timeString: string) {
    const unit = timeString.at(-1);
    const value = Number(timeString.slice(0, -1));
    if (isNaN(value)) return 0;
    return unit == 'h' ? value * 3.6e6 : unit == 'd' ? value * 24 * 3.6e6 : 0;
  }

  async validateSocialLogin(
    authProvider: AuthTypeEnum,
    socialData: SocialInterface,
  ): Promise<LoginResponseType[]> {
    try {
      const userRegistered = await this.memberModel.findAllByEmailOrPhone(
        socialData?.email?.toLowerCase(),
      );
      if (
        userRegistered.length > 0 &&
        userRegistered?.[0]?.provider !== authProvider
      )
        throw new HttpException('User registered', HttpStatus.BAD_REQUEST);

      let userId: string = userRegistered?.[0]?._id;
      if (userRegistered.length === 0) {
        const created = await this.memberModel.createBySocial({
          socialId: socialData.id,
          firstName: socialData.firstName,
          lastName: socialData.lastName,
          email: socialData?.email?.toLowerCase(),
          provider: authProvider,
        });

        userId = created._id;
      }

      await this.memberModel.active(socialData.email, true);

      const accessToken = this.generateToken({
        userId,
        email: socialData?.email?.toLowerCase(),
        firstName: socialData?.firstName,
        lastName: socialData?.lastName,
      });

      const jwtExpiresIn = this.configService.get<string>('auth.jwtExpiresIn', {
        infer: true,
      });

      return [
        {
          accessToken,
          refreshToken: this.configService.get<string>('auth.refreshSecret', {
            infer: true,
          }),
          accessTokenExpiresIn: this.convertTimeStringToMs(jwtExpiresIn),
        },
      ];
    } catch (error) {
      // throw new HttpException(
      //   error.message(),
      //   HttpStatus.INTERNAL_SERVER_ERROR,
      // );
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

  async createVerificationRegister(
    input: VerificationRegisterDto,
  ): Promise<NullableType<unknown>> {
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

      const verifyCode = this.utilsService.generateRandomNumber(6);
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
      if (input.provider === AuthTypeEnum.PHONE) {
        // const resp1 = await this.smsService.sendSms(
        //   input.email,
        //   `Your verification code is ${verifyCode}`,
        // );
        // console.log('SMS Response: ', resp1);
      } else if (input.provider === AuthTypeEnum.EMAIL) {
      }

      return [{ verifyCode }];
      // return {
      //   status: true,
      //   statusCode: HttpStatus.CREATED,
      //   message: 'Verification code sent successfully',
      //   data: [{ verifyCode }],
      // };
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

  async verifyOtpRegister(input: VerifyOtpDto): Promise<NullableType<unknown>> {
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

      return null;
      // return {
      //   status: true,
      //   statusCode: HttpStatus.CREATED,
      //   message: 'User verified successfully',
      //   data: [],
      // };
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

  async register(input: RegisterDto): Promise<NullableType<unknown>> {
    try {
      //! Check if user identity verified
      const userIdentityVerified =
        await this.verificationRegistrationModel.findOneByEmailOrPhone(
          input.email.toLowerCase(),
          [true],
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

      const hashedPassword = await bcrypt.hash(
        input.password,
        bcrypt.genSaltSync(10),
      );

      /*const created = */ await this.memberModel.create({
        ...input,
        email: input.email.toLowerCase(),
        password: hashedPassword,
      });

      return null;
      // return {
      //   status: true,
      //   statusCode: HttpStatus.CREATED,
      //   message: 'User registered successfully',
      //   data: [],
      // };
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

  async login(input: LoginDto): Promise<LoginResponseType[]> {
    try {
      //! Check if user registered
      const userRegistered = await this.memberModel.findOneByEmailOrPhone(
        input.email.toLowerCase(),
      );

      if (!userRegistered)
        throw new HttpException('User not registered', HttpStatus.BAD_REQUEST);

      const isMatched = await bcrypt.compare(
        input.password,
        userRegistered.password,
      );

      if (!isMatched)
        // return [{ accessToken: '', refreshToken: '', accessTokenExpiresIn: 0 }];
        throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);

      const accessToken = this.generateToken({
        userId: userRegistered._id,
        email: userRegistered.email,
        firstName: userRegistered.firstName,
        lastName: userRegistered.lastName,
      });

      await this.memberModel.active(userRegistered.email, true);
      return [
        {
          accessToken,
          refreshToken: this.configService.get<string>('auth.refreshSecret', {
            infer: true,
          }),
          accessTokenExpiresIn: this.convertTimeStringToMs(
            this.configService.get<string>('auth.jwtExpiresIn', {
              infer: true,
            }),
          ),
        },
      ];
    } catch (error) {
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

  async changePassword(
    input: ChangePasswordDto,
    decoded: JwtPayloadType,
  ): Promise<NullableType<unknown>> {
    try {
      //! Check Old password same as new password
      if (input.oldPassword === input.newPassword)
        throw new HttpException(
          'Old password same as new password',
          HttpStatus.BAD_REQUEST,
        );

      //! Check if user registered
      const userRegistered = await this.memberModel.findOneByEmailOrPhone(
        decoded.email,
      );

      if (!userRegistered)
        throw new HttpException('User not registered', HttpStatus.BAD_REQUEST);

      const isMatched = await bcrypt.compare(
        input.oldPassword,
        userRegistered.password,
      );

      if (!isMatched)
        throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
      const hashedPassword = await bcrypt.hash(input.newPassword, 10);
      await this.memberModel.updatePassword(userRegistered._id, hashedPassword);
      return null;
    } catch (error) {
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

  async createVerificationResetPassword(
    input: VerificationRegisterDto,
  ): Promise<NullableType<unknown>> {
    try {
      //! Check if user registered
      const userRegistered = await this.memberModel.findOneByEmailOrPhone(
        input.email.toLowerCase(),
      );

      if (!userRegistered)
        throw new HttpException('User not registered', HttpStatus.BAD_REQUEST);

      const verifyCode = this.utilsService.generateRandomNumber(6);
      const created = await this.verificationResetPasswordModel.create({
        userId: userRegistered._id,
        email: input.email.toLowerCase(),
        provider: input.provider,
        verifyCode,
      });

      //! Send verification code to user (OTP via Email or Phone)

      return [{ transactionId: created._id, verifyCode }];
    } catch (error) {
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

  async verifyOtpResetPassword(
    input: VerifyOtpResetPasswordDto,
  ): Promise<NullableType<unknown>> {
    try {
      //! Check if user identity verified
      const transaction = await this.verificationResetPasswordModel.findById(
        input.transactionId,
      );

      if (!transaction)
        throw new HttpException(
          'Transaction not found',
          HttpStatus.BAD_REQUEST,
        );

      if (transaction.verifyCode !== input.verifyCode)
        throw new HttpException(
          'Invalid verification code',
          HttpStatus.BAD_REQUEST,
        );

      //! Check if user exists
      await this.verificationResetPasswordModel.verify(input.transactionId);

      return null;
    } catch (error) {
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

  async resetPassword(input: ResetPasswordDto): Promise<NullableType<unknown>> {
    try {
      //! Check if user identity verified
      const transaction = await this.verificationResetPasswordModel.findById(
        input.transactionId,
        [true],
      );

      if (!transaction)
        throw new HttpException(
          'Transaction not found or not verified',
          HttpStatus.BAD_REQUEST,
        );

      //! Check if user exists
      await this.verificationResetPasswordModel.resetAt(input.transactionId);

      const hashedPassword = await bcrypt.hash(input.newPassword, 10);
      await this.memberModel.updatePassword(
        transaction.userId,
        hashedPassword,
      );

      return null;
    } catch (error) {
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
