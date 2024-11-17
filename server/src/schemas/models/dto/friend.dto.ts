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
  status: FriendStatusEnum;
}

export class AddFriendInteractionDto {
  @IsEnum(FriendInteractionActionEnum)
  action: FriendInteractionActionEnum;
}

export class GetFriendsByMemberIdDto {
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

export class FollowDto {
  friendId: string;
}

export class UnFollowDto {
  friendId: string;
}
