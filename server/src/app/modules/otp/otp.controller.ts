import { Controller, Post, Patch, Body } from '@nestjs/common';
import { OtpService } from './otp.service';
import { RequestOtpDto, VerifyOtpDto } from './dto';
import { ResponseMessage } from 'src/app/common/decorator/response-message.decorator';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('request')
  @ResponseMessage('OTP sent successfully')
  async create(@Body() body: RequestOtpDto) {
    return await this.otpService.create(body);
  }

  @Patch('verify')
  @ResponseMessage('OTP verified successfully')
  async verify(@Body() body: VerifyOtpDto) {
    return await this.otpService.verify(body);
  }
}
