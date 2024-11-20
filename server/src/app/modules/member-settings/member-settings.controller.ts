import { Body, Controller, Put, Req, UseGuards, Get } from '@nestjs/common';
import { MemberSettingsService } from './member-settings.service';
import { JwtPayloadType } from '../auth/strategies/types';
import { JwtAuthGuard } from '../auth/guard';
import { UpdateMemberSettingsDto } from 'src/schemas/models/dto';
import { ResponseMessage } from 'src/app/common/decorator/response-message.decorator';

@Controller('member-settings')
export class MemberSettingsController {
  constructor(private readonly memberSettingsService: MemberSettingsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getMemberSettings(@Req() req: Request & { decoded: JwtPayloadType }) {
    return await this.memberSettingsService.getMemberSettings(req.decoded);
  }

  @Put()
  @ResponseMessage('settings.UPDATE_SETTINGS_SUCCESSFULLY')
  @UseGuards(JwtAuthGuard)
  async updateMemberSettings(
    @Req() req: Request & { decoded: JwtPayloadType },
    @Body() body: UpdateMemberSettingsDto,
  ) {
    return await this.memberSettingsService.updateMemberSettings(
      req.decoded.userId,
      body,
    );
  }
}
