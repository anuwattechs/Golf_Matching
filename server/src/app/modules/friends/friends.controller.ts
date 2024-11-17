import {
  Controller,
  Get,
  Put,
  Param,
  UseGuards,
  Req,
  Delete,
  Request,
  Query,
  Body,
  Post,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { JwtAuthGuard } from '../auth/guard';
import { JwtPayloadType } from '../auth/strategies/types';
import { FriendStatusEnum } from 'src/shared/enums';
import { SearchFriendsDto } from 'src/schemas/models/dto';
// import { UserRegisteredGuard } from 'src/app/common/guard';

@Controller('friends')
@UseGuards(JwtAuthGuard)
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Put('follow/:friendId')
  async follow(
    @Param('friendId') friendId: string,
    @Request() req: { decoded: JwtPayloadType },
  ) {
    const { userId } = req.decoded;
    return await this.friendsService.sendFollowRequest(userId, friendId);
  }

  @Delete('unfollow/:friendId')
  async unFollow(
    @Param('friendId') friendId: string,
    @Request() req: { decoded: JwtPayloadType },
  ) {
    const { userId } = req.decoded;
    return await this.friendsService.toggleFollow(userId, friendId);
  }

  @Put('requests/:friendId/accept')
  async acceptRequest(
    @Param('friendId') friendId: string,
    @Request() req: { decoded: JwtPayloadType },
  ) {
    const { userId } = req.decoded;
    return await this.friendsService.acceptFollowRequest(userId, friendId);
  }

  @Put('requests/:friendId/decline')
  async declineRequest(
    @Param('friendId') friendId: string,
    @Request() req: { decoded: JwtPayloadType },
  ) {
    const { userId } = req.decoded;
    return await this.friendsService.declineFollowRequest(userId, friendId);
  }

  @Put('block/:friendId')
  async block(
    @Param('friendId') friendId: string,
    @Request() req: { decoded: JwtPayloadType },
  ) {
    const { userId } = req.decoded;
    return this.friendsService.toggleBlockStatus(userId, friendId);
  }

  @Get()
  async getAllFriends(
    @Query('status') status: string | string[],
    @Request() req: { decoded: JwtPayloadType },
  ) {
    const { userId } = req.decoded;

    let enumStatuses: FriendStatusEnum[] = [];
    if (status) {
      const statuses = Array.isArray(status) ? status : status.split(',');
      enumStatuses = statuses.map(
        (s) => FriendStatusEnum[s as keyof typeof FriendStatusEnum],
      );
    }

    return this.friendsService.getFriendsByUserId(
      userId,
      enumStatuses.length ? enumStatuses : undefined,
    );
  }

  @Get('requests')
  async getPendingRequests(@Request() req: { decoded: JwtPayloadType }) {
    const { userId } = req.decoded;
    return this.friendsService.getPendingRequests(userId);
  }

  @Post('search')
  async searchFriends(
    @Body() dto: SearchFriendsDto,
    @Request() req: { decoded: JwtPayloadType },
  ) {
    return this.friendsService.searchFriends(req.decoded.userId, dto);
  }

  @Get('suggestions')
  async getSuggestions(@Request() req: { decoded: JwtPayloadType }) {
    const { userId } = req.decoded;
    return [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        username: 'john_doe',
        avatar: 'https://randomuser.me/api/portraits',
      },
    ];
  }
}
