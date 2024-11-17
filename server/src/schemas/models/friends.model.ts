import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Friends } from '..';
import { FriendStatusEnum } from 'src/shared/enums';
import { UpdateFriendStatusDto, RemoveFriendDto } from './dto';

@Injectable()
export class FriendsModel {
  constructor(
    @InjectModel(Friends.name)
    private readonly friendsModel: Model<Friends>,
  ) {}

  async getFriendsByUserId(
    memberId: string,
    statuses?: FriendStatusEnum | FriendStatusEnum[],
  ): Promise<Friends[]> {
    if (statuses && statuses.length) {
      return this.friendsModel.find({
        memberId,
        status: { $in: statuses },
      });
    }

    return this.friendsModel.find({ memberId });
  }

  async findExistingFriend(
    memberId: string,
    friendId: string,
    status?: FriendStatusEnum,
  ): Promise<Friends | null> {
    console.log('memberId', memberId);
    console.log('friendId', friendId);
    const query = { memberId, friendId };
    if (status) query['status'] = status;
    return this.friendsModel.findOne(query);
  }

  async createNewFriendRequest(
    memberId: string,
    friendId: string,
    status = FriendStatusEnum.FOLLOWING,
  ): Promise<Friends> {
    const newFriend = new this.friendsModel({
      memberId,
      friendId,
      status,
    });

    return (await newFriend.save()).toObject();
  }

  async updateFriendStatus(dto: UpdateFriendStatusDto): Promise<Friends> {
    return this.friendsModel.findOneAndUpdate(
      { memberId: dto.memberId, friendId: dto.friendId },
      { $set: { status: dto.status } },
      { new: true, lean: true },
    );
  }

  async removeFriend(dto: RemoveFriendDto): Promise<Friends> {
    return this.friendsModel.findOneAndDelete(dto);
  }

  async searchFriends(
    query: string,
    userId: string,
    statuses?: FriendStatusEnum | FriendStatusEnum[],
  ): Promise<Friends[]> {
    const searchQuery = {
      $or: [
        { memberId: userId, friendId: { $regex: query, $options: 'i' } },
        { friendId: userId, memberId: { $regex: query, $options: 'i' } },
      ],
    };

    if (statuses && statuses.length) {
      searchQuery['status'] = { $in: statuses };
    }

    return this.friendsModel.find(searchQuery);
  }

  async getPendingRequests(memberId: string): Promise<Friends[]> {
    return this.friendsModel.find({
      friendId: memberId,
      status: FriendStatusEnum.PENDING,
    });
  }
}
