import {
  Controller,
  Post,
  Patch,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OtpService } from './otp.service';
import { RequestOtpDto, VerifyOtpDto } from './dto';
import { ResponseMessage } from 'src/app/common/decorator/response-message.decorator';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('request')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('otp.OTP_SENT_SUCCESSFULLY')
  async create(@Body() body: RequestOtpDto) {
    return await this.otpService.create(body);
  }

  @Patch('verify')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('otp.OTP_VERIFIED_SUCCESSFULLY')
  async verify(@Body() body: VerifyOtpDto) {
    return await this.otpService.verify(body);
  }
}
