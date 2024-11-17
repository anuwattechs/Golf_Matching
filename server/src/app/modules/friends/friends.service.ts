import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FriendsModel, MemberModel } from 'src/schemas/models';
import { Friends } from 'src/schemas';
import { FriendStatusEnum } from 'src/shared/enums';
import {
  ResultsPaginatedFriendsDto,
  SearchFriendsDto,
} from 'src/schemas/models/dto';
import { UtilsService } from 'src/shared/utils/utils.service';

enum ErrorMessages {
  BLOCKED = 'You are blocked by this user or have blocked this user',
  ALREADY_FOLLOWING = 'You are already following this user',
  REQUEST_PENDING = 'Friend request is already pending',
  FRIEND_NOT_FOUND = 'Friend relationship not found',
  UNAUTHORIZED = 'Unauthorized to accept or decline this request',
}

@Injectable()
export class FriendsService {
  constructor(
    private readonly friendsModel: FriendsModel,
    private readonly memberModel: MemberModel,
  ) {}

  async getFriendsByUserId(
    userId: string,
    statuses?: FriendStatusEnum | FriendStatusEnum[],
  ): Promise<Friends[]> {
    if (!statuses || statuses.length === 0) {
      return this.friendsModel.getFriendsByUserId(userId);
    }

    return this.friendsModel.getFriendsByUserId(userId, statuses);
  }

  private async checkBlockedStatus(
    memberId: string,
    friendId: string,
  ): Promise<void> {
    const [memberStatus, friendStatus] = await Promise.all([
      this.friendsModel.findExistingFriend(memberId, friendId),
      this.friendsModel.findExistingFriend(friendId, memberId),
    ]);

    if (
      memberStatus?.status === FriendStatusEnum.BLOCKED ||
      friendStatus?.status === FriendStatusEnum.BLOCKED
    ) {
      throw new HttpException(
        {
          status: false,
          statusCode: HttpStatus.FORBIDDEN,
          message: ErrorMessages.BLOCKED,
        },
        HttpStatus.FORBIDDEN,
      );
    }
  }

  private async getFriendStatus(memberId: string, friendId: string) {
    return await this.friendsModel.findExistingFriend(memberId, friendId);
  }

  private throwHttpException(message: string, statusCode: HttpStatus) {
    throw new HttpException({ status: false, statusCode, message }, statusCode);
  }

  async toggleFollow(memberId: string, friendId: string): Promise<Friends> {
    await this.checkBlockedStatus(memberId, friendId);

    const existingFriend = await this.getFriendStatus(memberId, friendId);
    const newStatus =
      existingFriend?.status === FriendStatusEnum.FOLLOWING
        ? FriendStatusEnum.REMOVED
        : FriendStatusEnum.FOLLOWING;

    return this.friendsModel.updateFriendStatus({
      memberId,
      friendId,
      status: newStatus,
    });
  }

  async sendFollowRequest(
    memberId: string,
    friendId: string,
    isPrivate = true,
  ): Promise<Friends> {
    await this.checkBlockedStatus(memberId, friendId);

    const existingFriend = await this.getFriendStatus(memberId, friendId);
    if (existingFriend) {
      switch (existingFriend.status) {
        case FriendStatusEnum.FOLLOWING:
          this.throwHttpException(
            ErrorMessages.ALREADY_FOLLOWING,
            HttpStatus.BAD_REQUEST,
          );
        case FriendStatusEnum.PENDING:
          this.throwHttpException(
            ErrorMessages.REQUEST_PENDING,
            HttpStatus.BAD_REQUEST,
          );
        case FriendStatusEnum.REMOVED:
          return this.friendsModel.updateFriendStatus({
            memberId,
            friendId,
            status: isPrivate
              ? FriendStatusEnum.PENDING
              : FriendStatusEnum.FOLLOWING,
          });
      }
    }

    const status = isPrivate
      ? FriendStatusEnum.PENDING
      : FriendStatusEnum.FOLLOWING;
    return this.friendsModel.createNewFriendRequest(memberId, friendId, status);
  }

  async acceptFollowRequest(
    memberId: string,
    friendId: string,
  ): Promise<Friends> {
    const existingFriend = await this.getFriendStatus(memberId, friendId);

    if (!existingFriend || existingFriend.status !== FriendStatusEnum.PENDING) {
      this.throwHttpException(
        ErrorMessages.FRIEND_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    if (memberId !== existingFriend.friendId) {
      this.throwHttpException(ErrorMessages.UNAUTHORIZED, HttpStatus.FORBIDDEN);
    }

    return this.friendsModel.updateFriendStatus({
      memberId,
      friendId,
      status: FriendStatusEnum.FOLLOWING,
    });
  }

  async declineFollowRequest(
    memberId: string,
    friendId: string,
  ): Promise<Friends> {
    const existingFriend = await this.getFriendStatus(memberId, friendId);

    if (!existingFriend || existingFriend.status !== FriendStatusEnum.PENDING) {
      this.throwHttpException(
        ErrorMessages.FRIEND_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    if (memberId !== existingFriend.friendId) {
      this.throwHttpException(ErrorMessages.UNAUTHORIZED, HttpStatus.FORBIDDEN);
    }

    return this.friendsModel.removeFriend({
      memberId: friendId,
      friendId: memberId,
    });
  }

  async toggleBlockStatus(
    memberId: string,
    friendId: string,
  ): Promise<Friends> {
    const existingFriend = await this.getFriendStatus(memberId, friendId);

    if (!existingFriend) {
      this.throwHttpException(
        ErrorMessages.FRIEND_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    const newStatus =
      existingFriend.status === FriendStatusEnum.BLOCKED
        ? FriendStatusEnum.REMOVED
        : FriendStatusEnum.BLOCKED;

    return this.friendsModel.updateFriendStatus({
      memberId,
      friendId,
      status: newStatus,
    });
  }

  async searchFriends(
    memberId: string,
    input: SearchFriendsDto,
  ): Promise<ResultsPaginatedFriendsDto> {
    const filterQuery = {
      _id: { $ne: memberId },
      ...this.buildFilterQuery(input),
    };
    const { result: allProfile, pagination } =
      await this.memberModel.findAllProfilesWithPagination(
        memberId,
        input.page,
        input.limit,
        filterQuery,
      );

    return {
      result: await Promise.all(
        allProfile
          ?.filter((profile) => profile.memberId !== memberId)
          ?.map(async (profile) => {
            const friends = await this.getFriendsByUserId(memberId, [
              FriendStatusEnum.FOLLOWING,
              FriendStatusEnum.PENDING,
            ]);

            const statusProfile = friends.find(
              (f) => f.friendId === profile.memberId,
            )?.status;

            return {
              ...profile,
              status: statusProfile || null,
            };
          }),
      ),
      pagination,
    };
  }

  private buildFilterQuery = (filter: any) => {
    const {
      query,
      customUserId,
      tags,
      yearExperience,
      averageScore,
      handicap,
      gender,
      location,
      course,
    } = filter;

    const filterQuery: Record<string, any> = {};

    if (query) {
      filterQuery.$or = [
        { firstName: { $regex: query, $options: 'i' } },
        { lastName: { $regex: query, $options: 'i' } },
      ];
    }

    if (customUserId) {
      filterQuery.customUserId = customUserId;
    }

    if (tags && tags.length > 0) {
      filterQuery.tags = { $in: tags };
    }

    if (yearExperience) {
      filterQuery.yearExperience = {
        $gte: yearExperience.min,
        $lte: yearExperience.max,
      };
    }

    if (averageScore) {
      filterQuery.averageScore = {
        $gte: averageScore.min,
        $lte: averageScore.max,
      };
    }

    if (typeof handicap === 'number') {
      filterQuery.handicap = handicap;
    }

    if (gender) {
      filterQuery.gender = gender;
    }

    if (location) {
      filterQuery.location = { $regex: location, $options: 'i' };
    }

    if (course) {
      filterQuery.favoriteCourse = { $regex: course, $options: 'i' };
    }

    return filterQuery;
  };
}
