import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { User } from 'src/schemas';
import * as speakeasy from 'speakeasy';
import { SocialInterface } from 'src/shared/interfaces';
import { NullableType } from 'src/shared/types/nullable.type';
import { LoginResponseDto } from '../auth-google/dto/login-response.dto';
import { AuthProvidersEnum } from 'src/shared/enums';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

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
      );
    }

    return userByEmail;
  }

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
      }
      return this.usersService.update(user.id, user);
    }

    // ถ้าพบอีเมลในระบบแต่ยังไม่มี social login ให้ return ผู้ใช้นั้น
    if (userByEmail) {
      return userByEmail;
    }

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
    }
  }
}
