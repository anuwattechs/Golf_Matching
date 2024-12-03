import {
  Controller,
  Post,
  Patch,
  Body,
  HttpCode,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OtpService } from './otp.service';
import { RequestOtpDto, RequestOtpAuthDto, VerifyOtpDto } from './dto';
import { ResponseMessage } from 'src/app/common/decorator/response-message.decorator';
import { Request } from 'express';
import { JwtPayloadType } from '../auth/strategies/types';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('init-mail-template')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('common.SUCCESS')
  async initMailTemplate() {
    return await this.otpService.initMailTemplate();
  }

  @Post('request')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('otp.OTP_SENT_SUCCESSFULLY')
  async create(@Body() body: RequestOtpDto) {
    return await this.otpService.create(body);
  }

  @Post('request/auth')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('otp.OTP_SENT_SUCCESSFULLY')
  async createByAuth(
    @Body() body: RequestOtpAuthDto,
    @Req() req: Request & { decoded: JwtPayloadType },
  ) {
    return await this.otpService.createByAuth(body, req.decoded);
  }

  @Patch('verify')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('otp.OTP_VERIFIED_SUCCESSFULLY')
  async verify(@Body() body: VerifyOtpDto) {
    return await this.otpService.verify(body);
  }

  @Patch('verify/auth')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('otp.OTP_VERIFIED_SUCCESSFULLY')
  async verifyByAuth(
    @Body() body: VerifyOtpDto,
    @Req() req: Request & { decoded: JwtPayloadType },
  ) {
    return await this.otpService.verifyByAuth(body, req.decoded);
  }
}
