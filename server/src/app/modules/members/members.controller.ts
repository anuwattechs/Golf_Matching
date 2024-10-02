import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/app/modules/auth/guard/jwt-auth.guard';
import { MembersService } from './members.service';
import { Request } from 'express';
import { JwtPayloadType } from 'src/app/modules/auth/strategy/jwt-payload.type';
import { ResponseMessage } from 'src/app/common/decorator/response-message.decorator';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('User reset password successfully')
  async findOneProsonalInfo(
    @Req() req: Request & { decoded: JwtPayloadType },
  ) /*: Promise<LoginResponseDto> */ {
    return await this.membersService.findOneProsonalInfo(req.decoded);
  }
}
