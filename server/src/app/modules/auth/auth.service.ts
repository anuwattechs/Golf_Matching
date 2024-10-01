<<<<<<< HEAD
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { User } from 'src/schemas';
import * as speakeasy from 'speakeasy';
import { SocialInterface } from 'src/shared/interfaces';
import { NullableType } from 'src/shared/types/nullable.type';
import { LoginResponseDto } from '../auth-google/dto/login-response.dto';
import { AuthProvidersEnum } from 'src/shared/enums';
=======
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
>>>>>>> b398a21 (Updated /auth*)

@Injectable()
export class AuthService {
  constructor(
    private utils: Utils,
    private memberModel: MemberModel,
    private verificationRegistrationModel: VerificationRegistrationModel,
    private verificationResetPasswordModel: VerificationResetPasswordModel,
  ) {}

<<<<<<< HEAD
  async register(createUserDto: CreateUserDto): Promise<void> {
    const otp = speakeasy.totp({
      secret: process.env.OTP_SECRET,
      encoding: 'base32',
    });
    console.log(otp);
  }

  async validateSocialLogin(
    authProvider: AuthProvidersEnum,
    socialData: SocialInterface,
  ): Promise<LoginResponseDto> {
    let user: NullableType<User> = null;
    const socialEmail = socialData?.email?.toLowerCase();
    let userByEmail: NullableType<User> = null;

    if (socialEmail) {
      userByEmail = await this.checkEmail(socialEmail, authProvider);
    }

    if (socialData.id) {
      user = await this.usersService.findBySocialIdAndProvider({
        socialId: socialData.id,
        provider: authProvider,
      });
    }

    const newUser = await this.handleUserCreationOrUpdate(
      user,
      userByEmail,
      socialData,
      authProvider,
    );

    return this.generateToken(newUser);
  }

  private async checkEmail(
    socialEmail: string,
    authProvider: AuthProvidersEnum,
  ): Promise<NullableType<User>> {
    if (!socialEmail) return null; // กรณีไม่มีอีเมลให้ข้ามไป
    const userByEmail = await this.usersService.findByEmail(
      socialEmail.toLowerCase(),
    );
    if (userByEmail && userByEmail.provider !== authProvider) {
      throw new HttpException(
        `Email ${socialEmail} is already registered with another method. Please use ${this.mapProvider(userByEmail?.provider)} to login.`,
        HttpStatus.BAD_REQUEST,
=======
  async createVerificationRegister(
    input: VerificationRegisterDto,
  ): Promise<ResponseType<any[]>> {
    try {
      //! Check if user registered
      const userRegistered = await this.memberModel.findAllByEmailOrPhone(
        input.email,
>>>>>>> b398a21 (Updated /auth*)
      );

      if (userRegistered.length > 0)
        throw new HttpException(
          'User already registered',
          HttpStatus.BAD_REQUEST,
        );

<<<<<<< HEAD
  private async handleUserCreationOrUpdate(
    user: NullableType<User>,
    userByEmail: NullableType<User>,
    socialData: SocialInterface,
    authProvider: AuthProvidersEnum,
  ): Promise<User> {
    // ถ้าพบผู้ใช้เดิม อัปเดตข้อมูลแล้วบันทึก
    if (user) {
      if (socialData.email && !userByEmail) {
        user.email = socialData.email.toLowerCase();
=======
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
>>>>>>> b398a21 (Updated /auth*)
      }

      //! Send verification code to user (OTP via Email or Phone)

<<<<<<< HEAD
    // สร้างผู้ใช้ใหม่ถ้าไม่พบผู้ใช้เดิม
    return this.usersService.create({
      email: socialData.email?.toLowerCase() || '',
      firstName: socialData.firstName || '',
      lastName: socialData.lastName || '',
      provider: authProvider,
      socialId: socialData.id || '',
    });
  }

  private generateToken(user: User): LoginResponseDto {
    return {
      token: '',
      refreshToken: '',
      tokenExpires: 0,
    };
  }

  private mapProvider(provider: AuthProvidersEnum): string {
    switch (provider) {
      case AuthProvidersEnum.GOOGLE:
        return 'google';
      case AuthProvidersEnum.FACEBOOK:
        return 'facebook';
      case AuthProvidersEnum.APPLE:
        return 'apple';
      default:
        return 'local';
=======
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
>>>>>>> b398a21 (Updated /auth*)
    }
  }
}
