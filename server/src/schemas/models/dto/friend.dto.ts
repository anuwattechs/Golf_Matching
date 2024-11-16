import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import {
  FriendInteractionActionEnum,
  FriendStatusEnum,
} from 'src/shared/enums';

export class AddFriendRequestDto {
  @IsString()
  @IsNotEmpty()
  friendId: string;
}

export class UpdateFriendStatusDto {
  @IsString()
  @IsNotEmpty()
  memberId: string;

  @IsString()
  @IsNotEmpty()
  friendId: string;

  @IsEnum(FriendStatusEnum)
  status: FriendStatusEnum; // สามารถใช้ enum เพื่อกำหนดสถานะต่างๆ
}

export class AddFriendInteractionDto {
  @IsEnum(FriendInteractionActionEnum)
  action: FriendInteractionActionEnum;
}

export class GetFriendsBymemberIdDto {
  @IsString()
  @IsNotEmpty()
  memberId: string;
}

export class RemoveFriendDto {
  @IsString()
  @IsNotEmpty()
  memberId: string;

  @IsString()
  @IsNotEmpty()
  friendId: string;
}
