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
    const socialEmail = socialData.email?.toLowerCase();

    const userByEmail = socialEmail
      ? await this.checkEmail(socialEmail, authProvider)
      : null;

    if (socialData.id) {
      user = await this.usersService.findBySocialIdAndProvider({
        socialId: socialData.id,
        provider: authProvider,
      });
    }

    user = await this.handleUserCreationOrUpdate(
      user,
      userByEmail,
      socialData,
      authProvider,
    );

    // Generate JWT Token

    return {
      token: '',
      refreshToken: '',
      tokenExpires: 0,
    };
  }

  private async checkEmail(
    socialEmail: string,
    authProvider: AuthProvidersEnum,
  ): Promise<NullableType<User>> {
    const userByEmail = await this.usersService?.findByEmail(socialEmail);
    if (userByEmail && userByEmail.provider !== authProvider) {
      throw new HttpException(
        `Email ${socialEmail} already registered with another method.`,
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
    if (user) {
      // ถ้ามี user อยู่แล้ว อัปเดตข้อมูลอีเมล (ถ้ามี) และบันทึก
      if (socialData.email && !userByEmail) {
        user.email = socialData.email.toLowerCase();
      }
      // return await this.usersService.update(user.id, user);
    }

    // ถ้าพบอีเมลในระบบแต่ยังไม่มี social login
    if (userByEmail) {
      return userByEmail;
    }

    // ถ้าไม่พบผู้ใช้ ให้สร้างผู้ใช้ใหม่จาก Social Data
    return await this.usersService.create({
      email: socialData.email?.toLowerCase() || '',
      firstName: socialData.firstName || '',
      lastName: socialData.lastName || '',
      provider: authProvider,
      socialId: socialData.id || '',
    });
  }
}
