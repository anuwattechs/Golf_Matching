import {
  Body,
  Controller,
  Get,
  Put,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/app/modules/auth/guard/jwt-auth.guard';
import { MembersService } from './members.service';
import { Request } from 'express';
import { JwtPayloadType } from 'src/app/modules/auth/strategies/types/jwt-payload.type';
import { ResponseMessage } from 'src/app/common/decorator/response-message.decorator';
import { UpdateProfileDto, ChangeInviteModeDto } from './dto';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Personal info retrieved successfully')
  async findOneProsonalInfo(
    @Req() req: Request & { decoded: JwtPayloadType },
  ) /*: Promise<LoginResponseDto> */ {
    return await this.membersService.findOneProsonalInfo(req.decoded);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Profile updated successfully')
  async updateProfile(
    @Body() body: UpdateProfileDto,
    @Req() req: Request & { decoded: JwtPayloadType },
  ) /*: Promise<LoginResponseDto> */ {
    return await this.membersService.updateProfile(body, req.decoded);
  }

  @Patch('change-invite-mode')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Invite mode changed successfully')
  async changeInviteMode(
    @Body() body: ChangeInviteModeDto,
    @Req() req: Request & { decoded: JwtPayloadType },
  ) /*: Promise<LoginResponseDto> */ {
    return await this.membersService.changeInviteMode(body, req.decoded);
  }
}
