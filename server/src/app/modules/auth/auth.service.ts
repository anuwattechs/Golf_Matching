import {
  Injectable,
  HttpException,
  HttpStatus,
  // UnauthorizedException,
} from '@nestjs/common';
import { LoginResponseType, NullableType } from 'src/shared/types';
import { SocialInterface } from 'src/shared/interfaces';
import * as bcrypt from 'bcrypt';
import {
  RegisterDto,
  LoginDto,
  ChangePasswordDto,
  ResetPasswordDto,
} from './dto';
import { MemberModel, VerificationCodesModel } from 'src/schemas/models';
import { JwtService } from '@nestjs/jwt';
import { AuthTypeEnum, VerifyTypeEnum } from 'src/shared/enums';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/app/config/config.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly memberModel: MemberModel,
    private readonly verificationCodesModel: VerificationCodesModel,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  validateToken(token: string): JwtPayloadType {
    return this.jwtService.verify(token, {
      // secret: '' + process.env.AUTH_JWT_SECRET,
      secret: this.configService.get<string>('auth.jwtSecret', {
        infer: true,
      }),
    });
  }

  validateRefreshToken(token: string): JwtPayloadType {
    return this.jwtService.verify(token, {
      // secret: '' + process.env.AUTH_REFRESH_SECRET,
      secret: this.configService.get<string>('auth.refreshSecret', {
        infer: true,
      }),
    });
  }

  private convertTimeStringToMs(timeString: string) {
    const unit = timeString.at(-1);
    const value = Number(timeString.slice(0, -1));
    if (isNaN(value)) return 0;
    return unit == 'h' ? value * 3.6e6 : unit == 'd' ? value * 24 * 3.6e6 : 0;
  }

  async refreshToken(decoded: JwtPayloadType): Promise<LoginResponseType> {
    try {
      const {
        accessToken,
        refreshToken,
        accessTokenExpiresIn,
        refreshTokenExpiresIn,
      } = await this.getTokensData({
        userId: decoded.userId,
        username: decoded.username,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
      });

      return {
        accessToken,
        refreshToken,
        accessTokenExpiresIn,
        refreshTokenExpiresIn,
      };
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

  async validateSocialLogin(
    authType: AuthTypeEnum,
    socialData: SocialInterface,
  ) /*: Promise<LoginResponseType[]>*/ {
    try {
      const userRegistered = await this.memberModel.findOneBySocialId({
        socialId: socialData.id,
        authType: authType,
      });

      const created = !userRegistered
        ? await this.memberModel.createBySocial({
            socialId: socialData.id,
            firstName: socialData.firstName,
            lastName: socialData.lastName,
            username: socialData?.email?.toLowerCase(),
            authType: authType,
          })
        : userRegistered;

      await this.memberModel.active(created._id, true);

      const {
        accessToken,
        refreshToken,
        accessTokenExpiresIn,
        refreshTokenExpiresIn,
      } = await this.getTokensData({
        userId: created._id,
        username: created.username,
        firstName: created.firstName,
        lastName: created.lastName,
      });

      const statusCode = created.isRegistered
        ? HttpStatus.CREATED
        : HttpStatus.OK;

      throw new HttpException(
        {
          status: true,
          statusCode,
          message: 'Login success',
          data: {
            accessToken,
            refreshToken,
            accessTokenExpiresIn,
            refreshTokenExpiresIn,
          },
        },
        statusCode,
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

  async register(input: RegisterDto): Promise<NullableType<unknown>> {
    try {
      //! Check if user verified
      const userVerified = await this.verificationCodesModel.findById(
        input.verifyId,
        [true],
      );
      if (!userVerified)
        throw new HttpException('User not verified', HttpStatus.BAD_REQUEST);
      if (userVerified.verifyType !== VerifyTypeEnum.REGISTER)
        throw new HttpException('Invalid verify type', HttpStatus.BAD_REQUEST);
      if (userVerified.username !== input.username.toLowerCase())
        throw new HttpException('Invalid username', HttpStatus.BAD_REQUEST);
      if (
        ![AuthTypeEnum.EMAIL, AuthTypeEnum.PHONE].includes(
          userVerified.authType,
        )
      )
        throw new HttpException('Invalid auth type', HttpStatus.BAD_REQUEST);

      //! Check if user registered
      const userRegistered = await this.memberModel.findAllByUsername(
        input.username.toLowerCase(),
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

      await this.memberModel.create({
        ...input,
        username: input.username.toLowerCase(),
        password: hashedPassword,
      });

      await this.verificationCodesModel.registerAt(userVerified._id);

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

  async login(input: LoginDto): Promise<LoginResponseType> {
    try {
      //! Check if user registered
      const userRegistered = await this.memberModel.findOneByUsername(
        input.username.toLowerCase(),
      );

      if (!userRegistered)
        throw new HttpException('User not registered', HttpStatus.BAD_REQUEST);

      const isMatched = await bcrypt.compare(
        input.password,
        userRegistered.password,
      );

      if (!isMatched)
        throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);

      /*
      const accessToken = this.generateAccessToken({
        userId: userRegistered._id,
        username: userRegistered.username,
        firstName: userRegistered.firstName,
        lastName: userRegistered.lastName,
      });

      const refreshToken = this.generateRefreshToken({
        userId: userRegistered._id,
        username: userRegistered.username,
        firstName: userRegistered.firstName,
        lastName: userRegistered.lastName,
      });

      await this.memberModel.active(userRegistered._id, true);

      const jwtExpiresIn = this.convertTimeStringToMs(
        this.configService.get<string>('auth.jwtExpiresIn', {
          infer: true,
        }),
      );
      const refreshTokenExpiresIn = this.convertTimeStringToMs(
        this.configService.get<string>('auth.refreshExpiresIn', {
          infer: true,
        }),
      );

      const now = Date.now();
      return [
        {
          accessToken,
          refreshToken,
          accessTokenExpiresIn: now + jwtExpiresIn,
          refreshTokenExpiresIn: now + refreshTokenExpiresIn,
        },
      ];
      */

      const {
        accessToken,
        refreshToken,
        accessTokenExpiresIn,
        refreshTokenExpiresIn,
      } = await this.getTokensData({
        userId: userRegistered._id,
        username: userRegistered.username,
        firstName: userRegistered.firstName,
        lastName: userRegistered.lastName,
      });

      return {
        accessToken,
        refreshToken,
        accessTokenExpiresIn,
        refreshTokenExpiresIn,
      };
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
      const userRegistered = await this.memberModel.findOneByUsername(
        decoded.username,
      );

      if (!userRegistered)
        throw new HttpException('User not registered', HttpStatus.BAD_REQUEST);

      const isMatched = await bcrypt.compare(
        input.oldPassword,
        userRegistered.password,
      );

      if (!isMatched)
        throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
      const hashedPassword = await bcrypt.hash(
        input.newPassword,
        bcrypt.genSaltSync(10),
      );
      await this.memberModel.updatePasswordById(
        userRegistered._id,
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

  async resetPassword(input: ResetPasswordDto): Promise<NullableType<unknown>> {
    try {
      //! Check if user verified
      const userVerified = await this.verificationCodesModel.findById(
        input.verifyId,
        [true],
      );
      if (!userVerified)
        throw new HttpException('User not verified', HttpStatus.BAD_REQUEST);
      if (userVerified.verifyType !== VerifyTypeEnum.REGISTER)
        throw new HttpException('Invalid verify type', HttpStatus.BAD_REQUEST);
      if (
        ![AuthTypeEnum.EMAIL, AuthTypeEnum.PHONE].includes(
          userVerified.authType,
        )
      )
        throw new HttpException('Invalid auth type', HttpStatus.BAD_REQUEST);

      //! Check if user exists
      await this.verificationCodesModel.resetAt(input.verifyId);

      const hashedPassword = await bcrypt.hash(
        input.newPassword,
        bcrypt.genSaltSync(10),
      );
      await this.memberModel.updatePasswordByUsername(
        userVerified.username,
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

  private async getTokensData(payload: JwtPayloadType) {
    const jwtExpiresIn = this.configService.getOrThrow<string>(
      'auth.jwtExpiresIn',
      {
        infer: true,
      },
    );
    const refreshExpiresIn = this.configService.getOrThrow<string>(
      'auth.refreshExpiresIn',
      {
        infer: true,
      },
    );

    const accessTokenExpiresIn =
      Date.now() + this.convertTimeStringToMs(jwtExpiresIn);
    const refreshTokenExpiresIn =
      Date.now() + this.convertTimeStringToMs(refreshExpiresIn);

    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        { ...payload },
        {
          secret: this.configService.getOrThrow<string>('auth.jwtSecret', {
            infer: true,
          }),
          expiresIn: jwtExpiresIn,
        },
      ),
      await this.jwtService.signAsync(
        { ...payload },
        {
          secret: this.configService.getOrThrow<string>('auth.refreshSecret', {
            infer: true,
          }),
          expiresIn: refreshExpiresIn,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresIn,
      refreshTokenExpiresIn,
    };
  }
}
