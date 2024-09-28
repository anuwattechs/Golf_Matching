import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ResponseMessage } from 'src/app/common/decorator/response-message.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ResponseMessage('User created successfully')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.authService.register(createUserDto);
    } catch (error) {
      throw new Error(error);
    }
  }

  //   @Post('verify-otp')
  //   async verifyOtp(@Body() body: { userId: string; token: string }) {
  //     const isValid = await this.authService.verifyOtp(body.userId, body.token);
  //     return { isValid };
  //   }

  //   @Post('set-password')
  //   async setPassword(@Body() body: { userId: string; password: string }) {
  //     const user = await this.authService.setPassword(body.userId, body.password);
  //     return { message: 'Password set successfully', user };
  //   }
}
