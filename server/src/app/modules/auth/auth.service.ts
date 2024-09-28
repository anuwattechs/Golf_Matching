import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';
import { User } from 'src/schemas';
import * as speakeasy from 'speakeasy';

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
}
