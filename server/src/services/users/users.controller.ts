import {
  Controller,
  Post,
  Get,
  Put,
  Patch,
  Body,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import {
  IdentityVerifyDto,
  RegisterDto,
  LoginDto,
  ChangePasswordDto,
  ChangeInviteModeDto,
  UpdatePersonalInfoDto,
  ConfirmOtpDto,
  ConfirmOtpResetPasswordDto,
  ResetPasswordDto,
} from './dto';
import { TJwtPayload } from 'src/types';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register/indentity-verify')
  async createIndentityVerifyRegister(
    @Body() body: IdentityVerifyDto,
    @Res() res: Response,
  ) {
    const result = await this.usersService.createIndentityVerifyRegister(body);
    return res.status(result.statusCode).send(result);
  }

  @Patch('register/confirm-indentity-verify')
  async identityRegisterConfirm(
    @Body() body: ConfirmOtpDto,
    @Res() res: Response,
  ) {
    const result = await this.usersService.identityRegisterConfirm(body);
    return res.status(result.statusCode).send(result);
  }

  @Post('register')
  async register(@Body() body: RegisterDto, @Res() res: Response) {
    const result = await this.usersService.register(body);
    return res.status(result.statusCode).send(result);
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const result = await this.usersService.login(body);
    return res.status(result.statusCode).send(result);
  }

  @Patch('change-password')
  async changePassword(
    @Body() body: ChangePasswordDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    const result = await this.usersService.changePassword(body, req.decoded);
    return res.status(result.statusCode).send(result);
  }

  @Patch('change-invite-mode')
  async changeInviteMode(
    @Body() body: ChangeInviteModeDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    const result = await this.usersService.changeInviteMode(body, req.decoded);
    return res.status(result.statusCode).send(result);
  }

  @Put()
  async updateProfile(
    @Body() body: UpdatePersonalInfoDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    const result = await this.usersService.updateProfile(body, req.decoded);
    return res.status(result.statusCode).send(result);
  }

  @Get('info')
  async findOneProsonalInfo(
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    const result = await this.usersService.findOneProsonalInfo(req.decoded);
    return res.status(result.statusCode).send(result);
  }

  @Post('forgot-password/indentity-verify')
  async createIndentityVerifyResetPassword(
    @Body() body: IdentityVerifyDto,
    @Res() res: Response,
  ) {
    const result =
      await this.usersService.createIndentityVerifyResetPassword(body);
    return res.status(result.statusCode).send(result);
  }

  @Patch('forgot-password/confirm-indentity-verify')
  async identityResetPasswordConfirm(
    @Body() body: ConfirmOtpResetPasswordDto,
    @Res() res: Response,
  ) {
    const result = await this.usersService.identityResetPasswordConfirm(body);
    return res.status(result.statusCode).send(result);
  }

  @Patch('forgot-password/reset')
  async resetPassword(@Body() body: ResetPasswordDto, @Res() res: Response) {
    const result = await this.usersService.resetPassword(body);
    return res.status(result.statusCode).send(result);
  }
}
