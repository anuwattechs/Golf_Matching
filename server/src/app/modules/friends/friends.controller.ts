import { Controller, Get, Put, Param, UseGuards, Req } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { JwtAuthGuard } from '../auth/guard';
import { JwtPayloadType } from '../auth/strategies/types';

@Controller('friends')
@UseGuards(JwtAuthGuard)
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Put('follow/:friendId')
  async follow(
    @Param('friendId') friendId: string,
    @Req() req: Request & { decoded: JwtPayloadType },
  ) {
    const { userId } = req.decoded;
    return await this.friendsService.toggleFollow(userId, friendId);
  }

  @Put('block/:friendId')
  async toggleBlockStatus(
    @Param('friendId') friendId: string,
    @Req() req: Request & { decoded: JwtPayloadType },
  ) {
    const { userId } = req.decoded;
    return await this.friendsService.toggleBlockStatus(userId, friendId);
  }

  @Get()
  async getFriendsByUserId(@Req() req: Request & { decoded: JwtPayloadType }) {
    const { userId } = req.decoded;
    return await this.friendsService.getFriendsByUserId(userId);
  }
}
