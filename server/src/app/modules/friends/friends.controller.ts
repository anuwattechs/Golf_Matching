import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import {
  AddFriendRequestDto,
  UpdateFriendStatusDto,
  AddFriendInteractionDto,
  RemoveFriendDto,
} from 'src/schemas/models/dto';
import { JwtAuthGuard } from '../auth/guard';
import { JwtPayloadType } from '../auth/strategies/types';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async addFriendRequest(
    @Body() dto: AddFriendRequestDto,
    @Req() req: Request & { decoded: JwtPayloadType },
  ) {
    return await this.friendsService.addFriendRequest(
      dto.friendId,
      req.decoded.userId,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getFriendsByUserId(@Req() req: Request & { decoded: JwtPayloadType }) {
    return await this.friendsService.getFriendsByUserId(req.decoded.userId);
  }

  @Put('status')
  async updateFriendStatus(@Body() dto: UpdateFriendStatusDto) {
    return await this.friendsService.updateFriendStatus(dto);
  }

  @Get(':memberId/:friendId')
  async getFriendByIds(
    @Param('memberId') memberId: string,
    @Param('friendId') friendId: string,
  ) {
    return await this.friendsService.getFriendByIds(memberId, friendId);
  }

  @Delete()
  async removeFriend(@Body() dto: RemoveFriendDto) {
    return await this.friendsService.removeFriend(dto);
  }
}
