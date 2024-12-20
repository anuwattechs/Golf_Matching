import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsArray,
  IsNumber,
  IsOptional,
  Max,
  Min,
  ValidateNested,
  IsBoolean,
  IsInt,
  IsObject,
  IsPositive,
} from 'class-validator';
import { plainToInstance, Transform, Type } from 'class-transformer';
import {
  FriendInteractionActionEnum,
  FriendStatusEnum,
  GenderEnum,
} from 'src/shared/enums';
import { ProfileForSearch } from './member.dto';
import { PaginationDto, ResultPaginationDto } from 'src/shared/dto';

export class AddFriendRequestDto {
  @IsString()
  @IsNotEmpty()
  receiverId: string;
}

export class UpdateFriendStatusDto {
  @IsString()
  @IsNotEmpty()
  senderId: string;

  @IsString()
  @IsNotEmpty()
  receiverId: string;

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
  senderId: string;
}

export class RemoveFriendDto {
  @IsString()
  @IsNotEmpty()
  senderId: string;

  @IsString()
  @IsNotEmpty()
  receiverId: string;
}

export class FollowDto {
  receiverId: string;
}

export class UnFollowDto {
  receiverId: string;
}

export class RangeDto {
  @IsNumber()
  @Min(0)
  min: number;

  @IsNumber()
  @Min(0)
  max: number;
}

export class SearchFriendsDto {
  @IsString()
  @IsOptional()
  query: string;

  @IsString()
  @IsOptional()
  customUserId: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags: string[];

  @ValidateNested()
  @Type(() => RangeDto)
  @IsOptional()
  yearExperience: RangeDto;

  @ValidateNested()
  @Type(() => RangeDto)
  @IsOptional()
  averageScore: RangeDto;

  @IsNumber()
  @IsOptional()
  @Min(0)
  handicap: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  bestScore: number;

  @IsEnum(GenderEnum)
  @IsOptional()
  gender: GenderEnum;

  @IsString()
  @IsOptional()
  location: string;

  @IsString()
  @IsOptional()
  favoriteCourse: string;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page: number;

  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit: number;
}

export class ResultsPaginatedFriendsDto extends ResultPaginationDto<ProfileForSearch> {}

export class FilterFriendDto {
  @IsString()
  @IsOptional()
  query: string;

  @IsString()
  @IsOptional()
  customUserId: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags: string[];

  @ValidateNested()
  @Type(() => RangeDto)
  @IsOptional()
  yearExperience: RangeDto;

  @ValidateNested()
  @Type(() => RangeDto)
  @IsOptional()
  averageScore: RangeDto;

  @IsNumber()
  @IsOptional()
  @Min(0)
  handicap: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  bestScore: number;
}

export class SortFriendDto {
  @Type(() => String)
  @IsString()
  orderBy: keyof ProfileForSearch;

  @IsString()
  order: string;
}

export class QueryFriendsDto {
  @Transform(({ value }) => (value ? Number(value) : 1))
  @IsNumber()
  @IsOptional()
  page?: number;

  @Transform(({ value }) => (value ? Number(value) : 10))
  @IsNumber()
  @IsOptional()
  limit?: number;

  @IsOptional()
  @Transform(({ value }) =>
    value ? plainToInstance(FilterFriendDto, JSON.parse(value)) : undefined,
  )
  @ValidateNested()
  @Type(() => FilterFriendDto)
  filters?: FilterFriendDto | null;

  @IsOptional()
  @Transform(({ value }) => {
    return value
      ? plainToInstance(SortFriendDto, JSON.parse(value))
      : undefined;
  })
  @ValidateNested({ each: true })
  @Type(() => SortFriendDto)
  sort?: SortFriendDto[] | null;
}
