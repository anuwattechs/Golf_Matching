import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { LoginResponseType, NullableType } from 'src/shared/types';
import { SocialInterface } from 'src/shared/interfaces';
import * as bcrypt from 'bcrypt';
import {
  VerificationRegisterDto,
  VerifyOtpDto,
  RegisterDto,
  LoginDto,
} from './dto';
import {
  MemberModel,
  VerificationRegistrationModel,
  VerificationResetPasswordModel,
} from 'src/schemas/models';
import { UtilsService } from 'src/shared/utils/utils.service';
import { JwtService } from '@nestjs/jwt';
import { AuthProvidersEnum } from 'src/shared/enums';
import { JwtPayloadType } from './strategy/jwt-payload.type';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/app/config/config.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly utilsService: UtilsService,
    private readonly memberModel: MemberModel,
    private readonly verificationRegistrationModel: VerificationRegistrationModel,
    private readonly verificationResetPasswordModel: VerificationResetPasswordModel,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  private generateToken(payload: JwtPayloadType): string {
    return this.jwtService.sign(payload);
  }

  private convertTimeStringToMs(timeString: string) {
    const unit = timeString.at(-1);
    const value = Number(timeString.slice(0, -1));
    if (isNaN(value)) return 0;
    return unit == 'h' ? value * 3.6e6 : unit == 'd' ? value * 24 * 3.6e6 : 0;
  }

  async validateSocialLogin(
    authProvider: AuthProvidersEnum,
    socialData: SocialInterface,
  ): Promise<LoginResponseType[]> {
    try {
      const userRegistered = await this.memberModel.findAllByEmailOrPhone(
        socialData?.email?.toLowerCase(),
      );
      if (userRegistered.length > 0)
        throw new HttpException('User registered', HttpStatus.BAD_REQUEST);

      const created = await this.memberModel.createBySocial({
        socialId: socialData.id,
        firstName: socialData.firstName,
        lastName: socialData.lastName,
        email: socialData?.email?.toLowerCase(),
        provider: authProvider,
      });

      const accessToken = this.generateToken({
        userId: created._id,
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
      throw new HttpException(
        error.message(),
        HttpStatus.INTERNAL_SERVER_ERROR,
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

      return [{ verifyCode }];
      // return {
      //   status: true,
      //   statusCode: HttpStatus.CREATED,
      //   message: 'Verification code sent successfully',
      //   data: [{ verifyCode }],
      // };
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
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
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
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
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

      // const isMatched = await bcrypt.compare(
      //   input.password,
      //   userRegistered.password,
      // );

      // if (!isMatched)
      //   throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);

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
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /*
  async updateProfile(
    input: UpdatePersonalInfoDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      //! Check if user registered
      const userRegistered = await this.userModel.findOne({
        _id: decoded.user_id,
      });

      if (!userRegistered)
        return {
          status: 'error',
          statusCode: 400,
          message: 'User not registered',
          data: [],
        };

      const updated = await this.userModel.updateOne(
        { _id: decoded.user_id },
        {
          $set: {
            ...input,
          },
        },
      );

      return {
        status: 'success',
        statusCode: 201,
        message: 'User updated successfully',
        data: [updated],
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message,
        data: [],
      };
    }
  }

  async changePassword(
    input: ChangePasswordDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      //! Check Old password same as new password
      if (input.new_password === input.old_password)
        return {
          status: 'error',
          statusCode: 400,
          message: 'Old password same as new password',
          data: [],
        };

      //! Check if user registered
      const userRegistered = await this.userModel.findOne({
        _id: decoded.user_id,
      });

      if (!userRegistered)
        return {
          status: 'error',
          statusCode: 400,
          message: 'User not registered',
          data: [],
        };

      const isMatched = await bcrypt.compare(
        input.old_password,
        userRegistered.password,
      );

      if (!isMatched)
        return {
          status: 'error',
          statusCode: 400,
          message: 'Invalid password',
          data: [],
        };

      const hashedPassword = await bcrypt.hash(input.new_password, 10);

      const now = new Date();

      await this.userModel.updateOne(
        {
          _id: userRegistered._id,
        },
        {
          $set: {
            password: hashedPassword,
            updated_at: now,
          },
        },
      );

      return {
        status: 'success',
        statusCode: 201,
        message: 'Password changed successfully',
        data: [],
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message,
        data: [],
      };
    }
  }

  async changeInviteMode(
    input: ChangeInviteModeDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      // //! Check if user registered
      // const userRegistered = await this.userModel.findOne({
      //   _id: decoded.user_id,
      // });

      // if (!userRegistered)
      //   return {
      //     status: 'error',
      //     statusCode: 400,
      //     message: 'User not registered',
      //     data: [],
      //   };

      const now = new Date();
      await this.userModel.updateOne(
        {
          _id: decoded.user_id,
        },
        {
          $set: {
            is_invited: input.is_invited,
            updated_at: now,
          },
        },
      );

      return {
        status: 'success',
        statusCode: 201,
        message: 'Invite mode changed successfully',
        data: [{ is_invited: input.is_invited }],
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message,
        data: [],
      };
    }
  }

  async findOneProsonalInfo(decoded: TJwtPayload): Promise<TServiceResponse> {
    try {
      // //! Check if user registered
      // const userRegistered = await this.userModel.findOne({
      //   _id: decoded.user_id,
      // });

      // if (!userRegistered)
      //   return {
      //     status: 'error',
      //     statusCode: 400,
      //     message: 'User not registered',
      //     data: [],
      //   };

      const user = await this.userModel
        .findOne({
          _id: decoded.user_id,
        })
        .select(
          '-_id -password -is_actived -actived_at -created_at -updated_at',
        );

      return {
        status: 'success',
        statusCode: 200,
        message: 'User found successfully',
        data: [user],
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message,
        data: [],
      };
    }
  }

  async createIndentityVerifyResetPassword(
    input: IdentityVerifyDto,
  ): Promise<TServiceResponse> {
    try {
      //! Check if user registered
      const userRegistered = await this.userModel.findOne({
        $or: [
          { email: input.username.toLowerCase() },
          { phone_number: input.username.toLowerCase() },
        ],
      });

      if (!userRegistered)
        return {
          status: 'error',
          statusCode: 400,
          message: 'User not registered',
          data: [],
        };

      const verifyCode = this.randomNumber();
      const created = await this.identityVerificationForgorPasswordModel.create(
        {
          user_id: userRegistered._id,
          username: input.username.toLowerCase(),
          type: input.type,
          verify_code: verifyCode,
        },
      );

      //! Send verification code to user (OTP via Email or Phone)

      return {
        status: 'success',
        statusCode: 201,
        message: 'Indentity verified successfully',
        data: [
          {
            transaction_id: created._id,
            verify_code: verifyCode,
          },
        ],
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message,
        data: [],
      };
    }
  }

  async identityResetPasswordConfirm(
    input: ConfirmOtpResetPasswordDto,
  ): Promise<TServiceResponse> {
    try {
      //! Check if user identity verified
      const transaction =
        await this.identityVerificationForgorPasswordModel.findOne({
          _id: input.transaction_id,
        });

      if (!transaction)
        return {
          status: 'error',
          statusCode: 400,
          message: 'Transaction not found',
          data: [],
        };

      if (transaction.verify_code !== input.verify_code)
        return {
          status: 'error',
          statusCode: 400,
          message: 'Invalid verification code',
          data: [],
        };

      //! Check if user exists
      const now = new Date();
      await this.identityVerificationForgorPasswordModel.updateOne(
        {
          _id: input.transaction_id,
        },
        { $set: { is_verified: true, updated_at: now } },
      );

      return {
        status: 'success',
        statusCode: 201,
        message: 'Indentity verified successfully',
        data: [{ transaction_id: input.transaction_id }],
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message,
        data: [],
      };
    }
  }

  async resetPassword(input: ResetPasswordDto): Promise<TServiceResponse> {
    try {
      //! Check if user identity verified
      const transaction =
        await this.identityVerificationForgorPasswordModel.findOne({
          _id: input.transaction_id,
          is_verified: true,
          reseted_at: null,
        });

      if (!transaction)
        return {
          status: 'error',
          statusCode: 400,
          message: 'Transaction not found or not verified',
          data: [],
        };

      //! Check if user exists
      const now = new Date();
      await this.identityVerificationRegistrationModel.updateOne(
        {
          _id: input.transaction_id,
        },
        { $set: { reseted_at: now, updated_at: now } },
      );

      const hashedPassword = await bcrypt.hash(input.password, 10);
      await this.userModel.updateOne(
        { _id: transaction.user_id },
        {
          $set: {
            password: hashedPassword,
            updated_at: now,
          },
        },
      );

      return {
        status: 'success',
        statusCode: 201,
        message: 'Password reseted successfully',
        data: [],
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message,
        data: [],
      };
    }
  }
    */
}
