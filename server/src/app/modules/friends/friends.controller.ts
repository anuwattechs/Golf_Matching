import {
  Controller,
  Get,
  Put,
  Param,
  UseGuards,
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
import {
  ProfileForSearch,
  QueryFriendsDto,
  SearchFriendsDto,
} from 'src/schemas/models/dto';
import { infinityPagination } from 'src/shared/dto/infinity-pagination';
import { InfinityPaginationResponseDto } from 'src/shared/dto';
import { Friends } from 'src/schemas';
// import { UserRegisteredGuard } from 'src/app/common/guard';

@Controller('friends')
@UseGuards(JwtAuthGuard)
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Put('follow/:receiverId')
  async follow(
    @Param('receiverId') receiverId: string,
    @Request() req: { decoded: JwtPayloadType },
  ) {
    const { userId } = req.decoded;
    return await this.friendsService.sendFollowRequest(userId, receiverId);
  }

  @Delete('unfollow/:receiverId')
  async unFollow(
    @Param('receiverId') receiverId: string,
    @Request() req: { decoded: JwtPayloadType },
  ) {
    const { userId } = req.decoded;
    return await this.friendsService.toggleFollow(userId, receiverId);
  }

  @Put('requests/:senderId/accept')
  async acceptRequest(
    @Param('senderId') senderId: string,
    @Request() req: { decoded: JwtPayloadType },
  ) {
    const { userId } = req.decoded;
    return await this.friendsService.acceptFollowRequest(userId, senderId);
  }

  @Put('requests/:senderId/decline')
  async declineRequest(
    @Param('senderId') senderId: string,
    @Request() req: { decoded: JwtPayloadType },
  ) {
    const { userId } = req.decoded;
    return await this.friendsService.declineFollowRequest(userId, senderId);
  }

  @Put('block/:receiverId')
  async block(
    @Param('receiverId') receiverId: string,
    @Request() req: { decoded: JwtPayloadType },
  ) {
    const { userId } = req.decoded;
    return this.friendsService.toggleBlockStatus(userId, receiverId);
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

  @Get('demo-friends')
  async getDemoFriends(
    @Request() req: { decoded: JwtPayloadType },
    @Query() query: QueryFriendsDto,
  ): Promise<InfinityPaginationResponseDto<Friends>> {
    const page = query?.page ?? 1;
    const limit = query?.limit ?? 10;

    const friends = await this.friendsService.findManyWithPagination({
      filterOptions: query?.filters,
      sortOptions: query?.sort,
      paginationOptions: {
        page,
        limit,
      },
    });

    return infinityPagination(friends, { page, limit });
  }

  @Get('followings')
  async getFollowings(
    @Request() req: { decoded: JwtPayloadType },
  ): Promise<ProfileForSearch[]> {
    const { userId } = req.decoded;
    return this.friendsService.getFollowings(userId);
  }

  @Get('followers')
  async getFollowers(
    @Request() req: { decoded: JwtPayloadType },
  ): Promise<ProfileForSearch[]> {
    const { userId } = req.decoded;
    return this.friendsService.getFollowers(userId);
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
