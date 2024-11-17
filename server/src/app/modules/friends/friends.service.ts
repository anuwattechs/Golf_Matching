import { Injectable } from '@nestjs/common';
import { FriendsModel } from 'src/schemas/models';
import { Friends } from 'src/schemas';

@Injectable()
export class FriendsService {
  constructor(private readonly friendsModel: FriendsModel) {}

  async getFriendsByUserId(userId: string) {
    return await this.friendsModel.getFriendsByUserId(userId);
  }

  async getFriendByIds(userId: string, friendId: string) {
    return await this.friendsModel.getFriendByIds(userId, friendId);
  }

  async follow(memberId: string, friendId: string): Promise<Friends> {
    return await this.friendsModel.follow(memberId, friendId);
  }

  async unFollow(memberId: string, friendId: string): Promise<Friends> {
    return await this.friendsModel.unFollow(memberId, friendId);
  }

  async toggleBlockStatus(
    memberId: string,
    friendId: string,
  ): Promise<Friends> {
    return await this.friendsModel.toggleBlockStatus(memberId, friendId);
  }

  async toggleFollow(memberId: string, friendId: string): Promise<Friends> {
    return await this.friendsModel.toggleFollow(memberId, friendId);
  }
}
