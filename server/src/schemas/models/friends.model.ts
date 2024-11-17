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
    senderId: string,
    statuses?: FriendStatusEnum | FriendStatusEnum[],
  ): Promise<Friends[]> {
    if (statuses && statuses.length) {
      return this.friendsModel.find({
        senderId,
        status: { $in: statuses },
      });
    }

    return this.friendsModel.find({ senderId });
  }

  async findExistingFriend(
    senderId: string,
    receiverId: string,
    status?: FriendStatusEnum,
  ): Promise<Friends | null> {
    const query = { senderId, receiverId };
    if (status) query['status'] = status;
    return this.friendsModel.findOne(query);
  }

  async createNewFriendRequest(
    senderId: string,
    receiverId: string,
    status = FriendStatusEnum.FOLLOWING,
  ): Promise<Friends> {
    const newFriend = new this.friendsModel({
      senderId,
      receiverId,
      status,
    });

    return (await newFriend.save()).toObject();
  }

  async updateFriendStatus(dto: UpdateFriendStatusDto): Promise<Friends> {
    return this.friendsModel.findOneAndUpdate(
      { senderId: dto.senderId, receiverId: dto.receiverId },
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
        { senderId: userId, receiverId: { $regex: query, $options: 'i' } },
        { receiverId: userId, senderId: { $regex: query, $options: 'i' } },
      ],
    };

    if (statuses && statuses.length) {
      searchQuery['status'] = { $in: statuses };
    }

    return this.friendsModel.find(searchQuery);
  }

  async getPendingRequests(senderId: string): Promise<Friends[]> {
    return this.friendsModel.find({
      receiverId: senderId,
      status: FriendStatusEnum.PENDING,
    });
  }
}
