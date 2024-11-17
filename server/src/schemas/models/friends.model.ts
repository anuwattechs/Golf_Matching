import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Friends } from '..';
import { FriendStatusEnum } from 'src/shared/enums'; // import enums ที่ใช้งาน
import { UpdateFriendStatusDto, RemoveFriendDto } from './dto';

@Injectable()
export class FriendsModel {
  constructor(
    @InjectModel(Friends.name)
    private readonly friendsModel: Model<Friends>,
  ) {}

  async follow(memberId: string, friendId: string): Promise<Friends> {
    try {
      const existingFriend = await this.findExistingFriend(memberId, friendId);
      if (existingFriend) {
        throw new HttpException(
          {
            status: false,
            statusCode: HttpStatus.CONFLICT,
            message: 'Friend request already',
          },
          HttpStatus.CONFLICT,
        );
      } else {
        return await this.createNewFriendRequest(memberId, friendId);
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async unFollow(memberId: string, friendId: string): Promise<Friends> {
    try {
      const existingFriend = await this.findExistingFriend(memberId, friendId);
      if (!existingFriend) {
        throw new HttpException(
          {
            status: false,
            statusCode: HttpStatus.NOT_FOUND,
            message: 'Friend request not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        return await this.removeExistingFriendRequest(memberId, friendId);
      }
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private async findExistingFriend(
    memberId: string,
    friendId: string,
  ): Promise<Friends | null> {
    return this.friendsModel.findOne({ memberId, friendId });
  }

  private async removeExistingFriendRequest(
    memberId: string,
    friendId: string,
  ): Promise<Friends> {
    const result = await this.removeFriend({ memberId, friendId });
    if (!result) {
      throw this.handleError({
        status: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Failed to remove existing friend request',
      });
    }

    return result.toObject();
  }

  private async createNewFriendRequest(
    memberId: string,
    friendId: string,
  ): Promise<Friends> {
    const newFriend = new this.friendsModel({
      memberId,
      friendId,
      status: FriendStatusEnum.FOLLOWING,
    });
    return (await newFriend.save()).toObject();
  }

  private handleError(error: any): HttpException {
    console.log('error', error);
    return new HttpException(
      {
        status: false,
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      },
      error.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  async getFriendsByUserId(memberId: string): Promise<Friends[]> {
    return this.friendsModel
      .find({
        memberId,
        status: {
          $in: [
            FriendStatusEnum.FOLLOWING,
            FriendStatusEnum.FOLLOWED,
            FriendStatusEnum.BLOCKED,
          ],
        },
      })
      .lean();
  }

  async updateFriendStatus(dto: UpdateFriendStatusDto): Promise<Friends> {
    const { memberId, friendId, status } = dto;

    try {
      const updatedFriend = await this.friendsModel.findOneAndUpdate(
        { memberId, friendId },
        { $set: { status } },
        { new: true, lean: true },
      );

      if (!updatedFriend) {
        throw new HttpException(
          'Friend relationship not found',
          HttpStatus.NOT_FOUND,
        );
      }

      return updatedFriend;
    } catch (error) {
      throw new HttpException(
        {
          status: false,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message:
            error.message || 'An error occurred while updating friend status',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getFriendByIds(userId: string, friendId: string): Promise<Friends> {
    const friend = await this.friendsModel.findOne({ userId, friendId }).lean();
    if (!friend) {
      throw new HttpException('Friend not found', HttpStatus.NOT_FOUND);
    }
    return friend;
  }

  async removeFriend(dto: RemoveFriendDto): Promise<Friends> {
    const { memberId, friendId } = dto;

    const deletedFriend = await this.friendsModel.findOneAndDelete({
      memberId,
      friendId,
    });
    if (!deletedFriend) {
      throw new HttpException('Friend not found', HttpStatus.NOT_FOUND);
    }
    return deletedFriend;
  }

  async toggleBlockStatus(
    memberId: string,
    friendId: string,
  ): Promise<Friends> {
    const existingFriend = await this.findExistingFriend(memberId, friendId);
    if (!existingFriend) {
      throw new HttpException(
        {
          status: false,
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Friend not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const status =
      existingFriend.status === FriendStatusEnum.BLOCKED
        ? FriendStatusEnum.FOLLOWING
        : FriendStatusEnum.BLOCKED;

    return this.updateFriendStatus({ memberId, friendId, status });
  }

  async toggleFollow(memberId: string, friendId: string): Promise<Friends> {
    const existingFriend = await this.findExistingFriend(memberId, friendId);
    if (!existingFriend) {
      return this.createNewFriendRequest(memberId, friendId);
    }

    const status =
      existingFriend.status === FriendStatusEnum.FOLLOWING
        ? FriendStatusEnum.REMOVED
        : FriendStatusEnum.FOLLOWING;

    return this.updateFriendStatus({ memberId, friendId, status });
  }
}
