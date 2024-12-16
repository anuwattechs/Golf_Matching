import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { LoginResponseType, NullableType } from 'src/shared/types';
import { SocialInterface } from 'src/shared/interfaces';
import * as bcrypt from 'bcrypt';
import {
  RegisterDto,
  LoginDto,
  ChangePasswordDto,
  ResetPasswordDto,
  AddChangeUsernameDto,
} from './dto';
import { MemberModel, VerificationCodesModel } from 'src/schemas/models';
import { Member } from 'src/schemas';
import { JwtService } from '@nestjs/jwt';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/app/config/config.type';
import { VerifyTypeEnum, VerifyTypeAuthEnum } from 'src/shared/enums';
import { UtilsService } from 'src/shared/utils/utils.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly utilsService: UtilsService,
    private readonly memberModel: MemberModel,
    private readonly verificationCodesModel: VerificationCodesModel,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  validateToken(token: string): JwtPayloadType {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('auth.jwtSecret', {
        infer: true,
      }),
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
    // return await this.generateTokens(decoded);
    try {
      return await this.generateTokens({
        userId: decoded.userId,
        username: decoded.username,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
      });
    } catch (error) {
      this.handleException(error);
    }
  }

  async validateSocialLogin(
    socialData: SocialInterface,
  ): Promise<NullableType<unknown>> {
    // console.log('Social Data: ', socialData);
    try {
      const userRegistered = await this.memberModel.findOneBySocialId2({
        facebookId: socialData.facebookId || null,
        googleId: socialData.googleId || null,
        appleId: socialData.appleId || null,
      });

      // console.log(userRegistered);

      // return userRegistered;

      if (userRegistered) {
        await this.memberModel.setActive(userRegistered._id, true);
        return this.handleExistingUser(socialData, userRegistered);
      }
      return this.handleNewUser(socialData);
    } catch (error) {
      this.handleException(error);
    }
  }

  private async handleExistingUser(
    socialData: SocialInterface,
    userRegistered: Member,
  ): Promise<NullableType<unknown>> {
    const tokensData = await this.generateTokens({
      userId: userRegistered._id,
      firstName: userRegistered.firstName,
      lastName: userRegistered.lastName,
    });

    const statusCode = userRegistered.isRegistered
      ? HttpStatus.OK
      : HttpStatus.CREATED;

    return {
      userId: userRegistered._id,
      firstName: socialData.firstName,
      lastName: socialData.lastName,
      email: socialData.email,
      facebookId: socialData.facebookId || null,
      googleId: socialData.googleId || null,
      appleId: socialData.appleId || null,
      statusCode,
      ...(await this.generateTokens({
        userId: userRegistered._id,
        firstName: userRegistered.firstName,
        lastName: userRegistered.lastName,
      })),
    };
  }

  private async handleNewUser(
    socialData: SocialInterface,
  ): Promise<NullableType<unknown>> {
    const newUser = await this.memberModel.createBySocial({
      firstName: socialData.firstName,
      lastName: socialData.lastName,
      email: socialData.email,
      facebookId: socialData.facebookId || null,
      googleId: socialData.googleId || null,
      appleId: socialData.appleId || null,
    });

    await this.memberModel.setActive(newUser._id, true);

    // throw new HttpException(
    //   {
    //     status: true,
    //     statusCode: HttpStatus.CREATED,
    //     message: 'Social login successful, please complete your registration.',
    //     data: {
    //       userId: newUser._id,
    //       firstName: newUser.firstName,
    //       lastName: newUser.lastName,
    //     },
    //   },
    //   HttpStatus.CREATED,
    // );

    return {
      userId: newUser._id,
      firstName: socialData.firstName,
      lastName: socialData.lastName,
      email: socialData.email,
      facebookId: socialData.facebookId || null,
      googleId: socialData.googleId || null,
      appleId: socialData.appleId || null,
      statusCode: HttpStatus.CREATED,
      ...(await this.generateTokens({
        userId: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      })),
    };
  }

  async register(input: RegisterDto): Promise<NullableType<unknown>> {
    try {
      const userVerified = await this.verificationCodesModel.findById(
        input.verifyId,
        [true],
      );
      if (!userVerified)
        throw new HttpException(
          this.utilsService.getMessagesTypeSafe('auth.USER_NOT_VERIFIED'),
          HttpStatus.BAD_REQUEST,
        );
      if (userVerified.verifyType !== VerifyTypeEnum.REGISTER)
        throw new HttpException(
          this.utilsService.getMessagesTypeSafe('auth.INVALID_VERIFY_TYPE'),
          HttpStatus.BAD_REQUEST,
        );
      if (userVerified.username !== input.username.toLowerCase())
        throw new HttpException(
          this.utilsService.getMessagesTypeSafe('auth.INVALID_USERNAME'),
          HttpStatus.BAD_REQUEST,
        );

      const isEmail = this.utilsService.validateEmail(input.username);
      const isPhoneNo = this.utilsService.validatePhoneNumber(input.username);
      if (!(isEmail || isPhoneNo))
        throw new HttpException(
          this.utilsService.getMessagesTypeSafe('auth.INVALID_AUTH_TYPE'),
          HttpStatus.BAD_REQUEST,
        );

      const userRegistered = await this.memberModel.findAllByUsername(
        input.username.toLowerCase(),
      );

      if (userRegistered.length > 0)
        throw new HttpException(
          this.utilsService.getMessagesTypeSafe('auth.USER_ALREADY_REGISTERED'),
          HttpStatus.BAD_REQUEST,
        );

      const customUserId = await this.generateUniqueCustomUserId();

      const hashedPassword = await bcrypt.hash(
        input.password,
        bcrypt.genSaltSync(10),
      );

      const created = await this.memberModel.create({
        ...input,
        customUserId: customUserId,
        email: isEmail ? input.username.toLowerCase() : null,
        phoneNo: isPhoneNo ? input.username.toLowerCase() : null,
        password: hashedPassword,
      });

      await this.verificationCodesModel.registerAt(userVerified._id);

      return await this.memberModel.findProfileById(created._id);
    } catch (error) {
      this.handleException(error);
    }
  }

  async generateUniqueCustomUserId(): Promise<string> {
    let isUnique = false;
    let customUserId: string;

    while (!isUnique) {
      customUserId = Math.floor(10000000 + Math.random() * 90000000).toString();

      const existingUser = await this.memberModel.findOne({
        customUserId: customUserId,
      });
      if (!existingUser) {
        isUnique = true;
      }
    }

    return customUserId;
  }

  async login(input: LoginDto): Promise<LoginResponseType> {
    try {
      const isEmail = this.utilsService.validateEmail(input.username);
      const isPhoneNo = this.utilsService.validatePhoneNumber(input.username);
      if (!(isEmail || isPhoneNo))
        throw new HttpException(
          this.utilsService.getMessagesTypeSafe('auth.INVALID_AUTH_TYPE'),
          HttpStatus.BAD_REQUEST,
        );

      const userRegistered = await this.memberModel.findOneByUsername(
        input.username,
      );
      if (!userRegistered)
        throw new HttpException(
          this.utilsService.getMessagesTypeSafe('auth.USER_NOT_REGISTERED'),
          HttpStatus.BAD_REQUEST,
        );

      const isMatched = await bcrypt.compare(
        input.password,
        userRegistered.password,
      );
      if (!isMatched)
        throw new HttpException(
          this.utilsService.getMessagesTypeSafe('auth.INVALID_PASSWORD'),
          HttpStatus.BAD_REQUEST,
        );

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
    try {
      const userRegistered = await this.memberModel.findById(decoded.userId);
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

      if (input.newPassword === input.oldPassword)
        throw new HttpException(
          this.utilsService.getMessagesTypeSafe(
            'auth.NEW_PASSWORD_SAME_AS_OLD_PASSWORD',
          ),
          HttpStatus.BAD_REQUEST,
        );

      const isMatched = await bcrypt.compare(
        input.oldPassword,
        userRegistered.password,
      );

      if (!isMatched)
        throw new HttpException(
          this.utilsService.getMessagesTypeSafe('auth.INVALID_PASSWORD'),
          HttpStatus.BAD_REQUEST,
        );

      const hashedPassword = await bcrypt.hash(
        input.newPassword,
        bcrypt.genSaltSync(10),
      );

      await this.memberModel.updatePasswordById(decoded.userId, hashedPassword);

      return null;
    } catch (error) {
      this.handleException(error);
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
        throw new HttpException(
          this.utilsService.getMessagesTypeSafe('auth.USER_NOT_VERIFIED'),
          HttpStatus.BAD_REQUEST,
        );
      if (userVerified.verifyType !== VerifyTypeEnum.REGISTER)
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
      this.handleException(error);
    }
  }

  private async generateTokens(
    payload: JwtPayloadType,
  ): Promise<LoginResponseType> {
    const jwtExpiresIn = '1h';
    const refreshExpiresIn = '365d';

    // console.log(jwtExpiresIn, refreshExpiresIn);

    const accessTokenExpiresIn = Math.floor(
      (Date.now() + this.convertTimeStringToMs(jwtExpiresIn)) / 1000,
    );
    const refreshTokenExpiresIn = Math.floor(
      (Date.now() + this.convertTimeStringToMs(refreshExpiresIn)) / 1000,
    );

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { ...payload },
        {
          secret: this.configService.getOrThrow<string>('auth.jwtSecret', {
            infer: true,
          }),
          // expiresIn: jwtExpiresIn,
          expiresIn: '1h',
        },
      ),
      this.jwtService.signAsync(
        { ...payload },
        {
          secret: this.configService.getOrThrow<string>('auth.refreshSecret', {
            infer: true,
          }),
          // expiresIn: refreshExpiresIn,
          expiresIn: '365d',
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
