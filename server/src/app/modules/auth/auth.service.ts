import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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
      secret: this.configService.get<string>('auth.jwtSecret', { infer: true }),
    });
  }

  validateRefreshToken(token: string): JwtPayloadType {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('auth.refreshSecret', {
        infer: true,
      }),
    });
  }

  private convertTimeStringToMs(timeString: string): number {
    const unit = timeString.at(-1);
    const value = Number(timeString.slice(0, -1));
    if (isNaN(value)) return 0;
    return unit === 'h' ? value * 3.6e6 : unit === 'd' ? value * 24 * 3.6e6 : 0;
  }

  async refreshToken(decoded: JwtPayloadType): Promise<LoginResponseType> {
    return this.generateTokens(decoded);
  }

  async validateSocialLogin(
    socialData: SocialInterface,
  ): Promise<LoginResponseType> {
    try {
      const userRegistered = await this.memberModel.findOneBySocialId({
        facebookId: socialData.facebookId || null,
        googleId: socialData.googleId || null,
        appleId: socialData.appleId || null,
      });

      if (userRegistered) {
        await this.memberModel.setActive(userRegistered._id, true);
        return this.handleExistingUser(userRegistered);
      }

      return this.handleNewUser(socialData);
    } catch (error) {
      this.handleException(error);
    }
  }

  private async handleExistingUser(userRegistered): Promise<LoginResponseType> {
    const tokensData = await this.generateTokens({
      userId: userRegistered._id,
      firstName: userRegistered.firstName,
      lastName: userRegistered.lastName,
    });

    const statusCode = userRegistered.isRegistered
      ? HttpStatus.OK
      : HttpStatus.CREATED;
    const responseData = {
      ...tokensData,
      userId: userRegistered._id,
      firstName: userRegistered.firstName,
      lastName: userRegistered.lastName,
    };

    throw new HttpException(
      {
        status: true,
        statusCode,
        message:
          statusCode === HttpStatus.OK
            ? 'User logged in successfully'
            : 'Social login successful, please complete your registration.',
        data: responseData,
      },
      statusCode,
    );
  }

  private async handleNewUser(
    socialData: SocialInterface,
  ): Promise<LoginResponseType> {
    const newUser = await this.memberModel.createBySocial({
      firstName: socialData.firstName,
      lastName: socialData.lastName,
      email: socialData.email,
      facebookId: socialData.facebookId || null,
      googleId: socialData.googleId || null,
      appleId: socialData.appleId || null,
    });

    await this.memberModel.setActive(newUser._id, true);

    throw new HttpException(
      {
        status: true,
        statusCode: HttpStatus.CREATED,
        message: 'Social login successful, please complete your registration.',
        data: {
          userId: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
        },
      },
      HttpStatus.CREATED,
    );
  }

  async register(input: RegisterDto): Promise<NullableType<unknown>> {
    return null;
  }

  async login(input: LoginDto): Promise<LoginResponseType> {
    try {
      const userRegistered = await this.memberModel.findOneByUsername(
        input.username,
      );
      if (!userRegistered)
        throw new HttpException('User not registered', HttpStatus.BAD_REQUEST);

      const isMatched = await bcrypt.compare(
        input.password,
        userRegistered.password,
      );
      if (!isMatched)
        throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);

      return await this.generateTokens({
        userId: userRegistered._id,
        username: userRegistered.email,
        firstName: userRegistered.firstName,
        lastName: userRegistered.lastName,
      });
    } catch (error) {
      this.handleException(error);
    }
  }

  async changePassword(
    input: ChangePasswordDto,
    decoded: JwtPayloadType,
  ): Promise<NullableType<unknown>> {
    return null;
  }

  async resetPassword(input: ResetPasswordDto): Promise<NullableType<unknown>> {
    return null;
  }

  private async generateTokens(
    payload: JwtPayloadType,
  ): Promise<LoginResponseType> {
    const jwtExpiresIn = this.configService.getOrThrow<string>(
      'auth.jwtExpiresIn',
      { infer: true },
    );
    const refreshExpiresIn = this.configService.getOrThrow<string>(
      'auth.refreshExpiresIn',
      { infer: true },
    );

    const accessTokenExpiresIn =
      Date.now() + this.convertTimeStringToMs(jwtExpiresIn);
    const refreshTokenExpiresIn =
      Date.now() + this.convertTimeStringToMs(refreshExpiresIn);

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { ...payload },
        {
          secret: this.configService.getOrThrow<string>('auth.jwtSecret', {
            infer: true,
          }),
          expiresIn: jwtExpiresIn,
        },
      ),
      this.jwtService.signAsync(
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
