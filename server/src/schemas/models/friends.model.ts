import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Friends } from '..';
import { FriendStatusEnum } from 'src/shared/enums'; // import enums ที่ใช้งาน
import {
  UpdateFriendStatusDto,
  AddFriendInteractionDto,
  RemoveFriendDto,
} from './dto';

@Injectable()
export class FriendsModel {
  constructor(
    @InjectModel(Friends.name)
    private readonly friendsModel: Model<Friends>,
  ) {}

  async addFriendRequest(memberId: string, friendId: string): Promise<Friends> {
    try {
      const existingFriend = await this.findExistingFriend(memberId, friendId);

      if (existingFriend) {
        return await this.removeExistingFriendRequest(memberId, friendId);
      } else {
        return await this.createNewFriendRequest(memberId, friendId);
      }
    } catch (error) {
      // จัดการข้อผิดพลาด
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
          $in: [FriendStatusEnum.FOLLOWING, FriendStatusEnum.FOLLOWED],
        },
      })
      .lean();
  }

  async updateFriendStatus(dto: UpdateFriendStatusDto): Promise<Friends> {
    const { memberId, friendId, status } = dto;

    const updatedFriend = await this.friendsModel.findOneAndUpdate(
      { memberId, friendId },
      { status },
      { new: true },
    );
    if (!updatedFriend) {
      throw new HttpException('Friend not found', HttpStatus.NOT_FOUND);
    }
    return updatedFriend;
  }

  async addFriendInteraction(
    userId: string,
    friendId: string,
    dto: AddFriendInteractionDto,
  ): Promise<Friends> {
    const { action } = dto;

    const friend = await this.friendsModel.findOne({ userId, friendId });
    if (!friend) {
      throw new HttpException('Friend not found', HttpStatus.NOT_FOUND);
    }

    friend.interactionHistory.push({ action, date: new Date() });
    await friend.save();
    return friend;
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
}
