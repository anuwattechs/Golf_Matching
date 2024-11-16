import { HttpException, Injectable } from '@nestjs/common';
import {
  AddFriendRequestDto,
  UpdateFriendStatusDto,
  AddFriendInteractionDto,
  RemoveFriendDto,
} from 'src/schemas/models/dto';
import { FriendsModel, MemberModel } from 'src/schemas/models';

@Injectable()
export class FriendsService {
  constructor(
    private readonly friendsModel: FriendsModel,
    private readonly memberModel: MemberModel,
  ) {}

  async addFriendRequest(friendId: string, memberId: string) {
    const isFriendRegistered =
      await this.memberModel.checkUserRegistration(friendId);

    const isMemberRegistered =
      await this.memberModel.checkUserRegistration(memberId);

    if (friendId === memberId) {
      throw new HttpException(
        {
          status: false,
          statusCode: 400,
          message: 'User cannot add yourself as a friend',
        },
        400,
      );
    }

    if (!isFriendRegistered || !isMemberRegistered) {
      throw new HttpException(
        {
          status: false,
          statusCode: 400,
          message: 'User not registered',
        },
        400,
      );
    }

    return await this.friendsModel.addFriendRequest(memberId, friendId);
  }

  // ดึงข้อมูลเพื่อนจาก userId
  async getFriendsByUserId(userId: string) {
    return await this.friendsModel.getFriendsByUserId(userId);
  }

  // อัปเดตสถานะของเพื่อน
  async updateFriendStatus(dto: UpdateFriendStatusDto) {
    return await this.friendsModel.updateFriendStatus(dto);
  }

  // เพิ่ม interaction history
  async addFriendInteraction(
    userId: string,
    friendId: string,
    dto: AddFriendInteractionDto,
  ) {
    return await this.friendsModel.addFriendInteraction(userId, friendId, dto);
  }

  // ดึงข้อมูลเพื่อนตาม userId และ friendId
  async getFriendByIds(userId: string, friendId: string) {
    return await this.friendsModel.getFriendByIds(userId, friendId);
  }

  // ลบเพื่อน
  async removeFriend(dto: RemoveFriendDto) {
    return await this.friendsModel.removeFriend(dto);
  }
}
