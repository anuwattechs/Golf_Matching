import {
  Body,
  Controller,
  Get,
  Put,
  Patch,
  Req,
  UseGuards,
  UseInterceptors,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  UploadedFile,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/app/modules/auth/guard/jwt-auth.guard';
import { MembersService } from './members.service';
import { Request } from 'express';
import { JwtPayloadType } from 'src/app/modules/auth/strategies/types/jwt-payload.type';
import { ResponseMessage } from 'src/app/common/decorator/response-message.decorator';
import { UpdateProfileDto, ChangeInviteModeDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileAccessGuard } from '../auth/guard/profile-access.guard';
import { UpdateCustomUserIdDto } from './dto';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get('profile/details')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('members.PERSONAL_INFO_RETRIEVED_SUCCESSFULLY')
  async findOnePersonalInfo(@Req() req: Request & { decoded: JwtPayloadType }) {
    return await this.membersService.findOnePersonalInfo(req.decoded);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('members.PERSONAL_INFO_RETRIEVED_SUCCESSFULLY')
  async findOneProfile(@Req() req: Request & { decoded: JwtPayloadType }) {
    return await this.membersService.findOneProfile(
      req.decoded,
      req.decoded.userId,
      true,
    );
  }

  @Get(':memberId/profile')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('members.PERSONAL_INFO_RETRIEVED_SUCCESSFULLY')
  async findOneProfileById(
    @Param('memberId') memberId: string,
    @Req() req: Request & { decoded: JwtPayloadType },
  ) {
    return await this.membersService.findOneProfile(
      req.decoded,
      memberId,
      false,
    );
  }

  @Patch('custom-user-id')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('members.PERSONAL_INFO_RETRIEVED_SUCCESSFULLY')
  async updateCustomUserId(
    @Body() body: UpdateCustomUserIdDto,
    @Req() req: Request & { decoded: JwtPayloadType },
  ) {
    return this.membersService.updateCustomUserId(body, req.decoded);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('members.PROFILE_UPDATED_SUCCESSFULLY')
  async updateProfile(
    @Body() body: UpdateProfileDto,
    @Req() req: Request & { decoded: JwtPayloadType },
  ) /*: Promise<LoginResponseDto> */ {
    return await this.membersService.updateProfile(body, req.decoded);
  }

  @Patch('change-invite-mode')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('members.INVITE_MODE_CHANGED_SUCCESSFULLY')
  async changeInviteMode(
    @Body() body: ChangeInviteModeDto,
    @Req() req: Request & { decoded: JwtPayloadType },
  ) /*: Promise<LoginResponseDto> */ {
    return await this.membersService.changeInviteMode(body, req.decoded);
  }

  // update profile picture
  @Patch('profile-picture')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('picture'))
  async updateProfilePicture(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({
            maxSize: 30 * 1024 * 1024, // 5MB limit
            message: `File is too large. Max file size is 30MB`,
          }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
    @Req() req: Request & { decoded: JwtPayloadType },
  ) {
    return await this.membersService.updateProfilePicture(file, req.decoded);
  }
}
