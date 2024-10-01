import { Controller, Post, Body, HttpException, HttpStatus  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ResponseMessage } from 'src/app/common/decorator/response-message.decorator';
import { VerificationRegisterDto, VerifyOptDto, RegisterDto , LoginDto} from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verification-register')
  @ResponseMessage('')
  async createVerificationRegister(@Body() body: VerificationRegisterDto)/*: Promise<LoginResponseDto> */{
    try {
      return await this.authService.createVerificationRegister(body);
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
