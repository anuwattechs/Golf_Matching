import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FriendsModel, MemberModel } from 'src/schemas/models';
import { Friends } from 'src/schemas';
import { FriendStatusEnum } from 'src/shared/enums';
import {
  FilterFriendDto,
  ProfileForSearch,
  ResultsPaginatedFriendsDto,
  SearchFriendsDto,
  SortFriendDto,
} from 'src/schemas/models/dto';
import { MembersService } from '../members/members.service';
import { IPaginationOptions } from 'src/shared/types';
import { NotificationsService } from '../notifications/notifications.service';
import { FcmService } from 'src/app/common/services/fcm/fcm.service';

enum ErrorMessages {
  BLOCKED = 'You are blocked by this user or have blocked this user',
  ALREADY_FOLLOWING = 'You are already following this user',
  REQUEST_PENDING = 'Friend request is already pending',
  FRIEND_NOT_FOUND = 'Friend relationship not found',
  UNAUTHORIZED = 'Unauthorized to accept or decline this request',
  FOLLOWER_YOURSELF = 'You cannot follow yourself',
}

@Injectable()
export class FriendsService {
  constructor(
    private readonly friendsModel: FriendsModel,
    private readonly memberModel: MemberModel,
    private readonly memberService: MembersService,
    private readonly notificationService: NotificationsService,
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

  async getPendingRequests(senderId: string): Promise<Friends[]> {
    return this.friendsModel.getPendingRequests(senderId);
  }

  private async checkBlockedStatus(
    senderId: string,
    receiverId: string,
  ): Promise<void> {
    if (senderId === receiverId) {
      return;
    }
    const [memberStatus, friendStatus] = await Promise.all([
      this.friendsModel.findExistingFriend(senderId, receiverId),
      this.friendsModel.findExistingFriend(receiverId, senderId),
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

  private async getFriendStatus(senderId: string, receiverId: string) {
    return await this.friendsModel.findExistingFriend(senderId, receiverId);
  }

  private throwHttpException(message: string, statusCode: HttpStatus) {
    throw new HttpException({ status: false, statusCode, message }, statusCode);
  }

  async toggleFollow(senderId: string, receiverId: string): Promise<Friends> {
    await this.checkBlockedStatus(senderId, receiverId);

    const existingFriend = await this.getFriendStatus(senderId, receiverId);
    const newStatus =
      existingFriend?.status === FriendStatusEnum.FOLLOWING
        ? FriendStatusEnum.REMOVED
        : FriendStatusEnum.FOLLOWING;

    return this.friendsModel.updateFriendStatus({
      senderId,
      receiverId,
      status: newStatus,
    });
  }

  async sendFollowRequest(
    senderId: string,
    receiverId: string,
    isPrivate = false,
  ): Promise<Friends> {
    if (senderId === receiverId) {
      this.throwHttpException(
        ErrorMessages.FOLLOWER_YOURSELF,
        HttpStatus.FORBIDDEN,
      );
    }
    await this.checkBlockedStatus(senderId, receiverId);

    const existingFriend = await this.getFriendStatus(senderId, receiverId);
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
            senderId,
            receiverId,
            status: isPrivate
              ? FriendStatusEnum.PENDING
              : FriendStatusEnum.FOLLOWING,
          });
      }
    }

    const status = isPrivate
      ? FriendStatusEnum.PENDING
      : FriendStatusEnum.FOLLOWING;

    const resSaveNotify = await this.notificationService.createNotification({
      memberId: receiverId,
      type: 'FOLLOWING_REQUEST',
      message: `${senderId} followed you`,
      metadata: { actionBy: senderId },
      isRead: false,
    });

    if (!resSaveNotify) {
      this.throwHttpException(
        'Failed to send follow request',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return this.friendsModel.createNewFriendRequest(
      senderId,
      receiverId,
      status,
    );
  }

  async acceptFollowRequest(
    senderId: string,
    receiverId: string,
  ): Promise<Friends> {
    const existingFriend = await this.friendsModel.findExistingFriend(
      receiverId,
      senderId,
      FriendStatusEnum.PENDING,
    );

    if (!existingFriend || existingFriend.status !== FriendStatusEnum.PENDING) {
      this.throwHttpException(
        ErrorMessages.FRIEND_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    if (senderId !== existingFriend.receiverId) {
      this.throwHttpException(ErrorMessages.UNAUTHORIZED, HttpStatus.FORBIDDEN);
    }

    return this.friendsModel.updateFriendStatus({
      senderId: receiverId,
      receiverId: senderId,
      status: FriendStatusEnum.FOLLOWING,
    });
  }

  async declineFollowRequest(
    senderId: string,
    receiverId: string,
  ): Promise<Friends> {
    const existingFriend = await this.friendsModel.findExistingFriend(
      receiverId,
      senderId,
      FriendStatusEnum.PENDING,
    );

    if (!existingFriend || existingFriend.status !== FriendStatusEnum.PENDING) {
      this.throwHttpException(
        ErrorMessages.FRIEND_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    if (senderId !== existingFriend.receiverId) {
      this.throwHttpException(ErrorMessages.UNAUTHORIZED, HttpStatus.FORBIDDEN);
    }

    return this.friendsModel.removeFriend({
      senderId: receiverId,
      receiverId: senderId,
    });
  }

  async toggleBlockStatus(
    senderId: string,
    receiverId: string,
  ): Promise<Friends> {
    const existingFriend = await this.getFriendStatus(senderId, receiverId);

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
      senderId,
      receiverId,
      status: newStatus,
    });
  }

  async searchFriends(
    senderId: string,
    input: SearchFriendsDto,
  ): Promise<ResultsPaginatedFriendsDto> {
    const filterQuery = {
      _id: { $ne: senderId },
      ...this.buildFilterQuery(input),
    };

    const { result: allProfile, pagination } =
      await this.memberService.findAllProfilesWithPagination(
        input.page,
        input.limit,
        filterQuery,
      );

    return {
      result: await Promise.all(
        allProfile
          ?.filter((profile) => profile.memberId !== senderId)
          ?.map(async (profile) => {
            const friends = await this.getFriendsByUserId(senderId, [
              FriendStatusEnum.FOLLOWING,
              FriendStatusEnum.PENDING,
            ]);

            const statusProfile = friends.find(
              (f) => f.receiverId === profile.memberId,
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

  async getFollowings(userId: string): Promise<ProfileForSearch[]> {
    const friends = await this.getFriendsByUserId(userId, [
      FriendStatusEnum.FOLLOWING,
    ]);

    return this.memberModel
      ?.getProfilesByIds(
        friends?.filter((r) => r.senderId === userId).map((f) => f.receiverId),
      )
      ?.then((profiles) =>
        profiles.map((profile) =>
          this.memberService.buildProfileForSearch(profile),
        ),
      )
      .catch((e) => {
        console.log(e);
        return [];
      });
  }

  async getFollowers(userId: string): Promise<ProfileForSearch[]> {
    const friends = await this.friendsModel.getFollowersByUserId(
      userId,
      FriendStatusEnum.FOLLOWING,
    );

    return this.memberModel
      .getProfilesByIds(
        friends?.filter((r) => r.receiverId === userId).map((f) => f.senderId),
      )
      ?.then((profiles) => {
        return profiles.map((profile) =>
          this.memberService.buildProfileForSearch(profile),
        );
      });
  }

  findManyWithPagination({
    filterOptions,
    sortOptions,
    paginationOptions,
  }: {
    filterOptions?: FilterFriendDto | null;
    sortOptions?: SortFriendDto[] | null;
    paginationOptions: IPaginationOptions;
  }): Promise<Friends[]> {
    return this.friendsModel.findManyWithPagination({
      filterOptions,
      sortOptions,
      paginationOptions,
    });
  }
}
