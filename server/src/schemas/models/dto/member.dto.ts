import { Type } from "class-transformer";
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { FriendStatusEnum, GenderEnum } from "src/shared/enums";

export class CreateMemberDto {
  firstName: string;
  lastName: string;
  birthDate: string;
  customUserId: string;
  gender: GenderEnum;
  email?: string | null; // Optional or required based on your application logic
  phoneNo?: string | null; // Optional or required based on your application logic
  password: string; // Required
  country: string;
  location: string;
  nickName?: string; // Optional
  occupation?: string; // Optional
  tags?: string[]; // Optional
  yearStart?: string; // Optional
  avgScore?: number; // Optional
  favoriteCourses?: string[]; // Optional
  countHoleInOne?: number; // Optional
  bestScore?: number; // Optional
  clubBrands?: string; // Optional
}

export class UpdateMemberDto {
  userId: string; // Required
  firstName?: string; // Optional, in case of partial updates
  lastName?: string; // Optional, in case of partial updates
  birthDate?: string; // Optional, in case of partial updates
  gender?: GenderEnum; // Optional, in case of partial updates
  country?: string; // Optional
  location?: string; // Optional
  nickName?: string; // Optional
  occupation?: string; // Optional
  tags?: string[]; // Optional
  yearStart?: string; // Optional
  avgScore?: number; // Optional
  favoriteCourses?: string[]; // Optional
  countHoleInOne?: number; // Optional
  bestScore?: number; // Optional
  clubBrands?: string; // Optional
  introduction?: string; // Optional
}

export class CreateMemberBySocialDto {
  firstName: string;
  lastName: string;
  email?: string; // Optional, in case the email is needed for registration
  facebookId?: string; // Optional, for linking accounts
  googleId?: string; // Optional, for linking accounts
  appleId?: string; // Optional, for linking accounts
}

export class FindBySocialIdDto {
  facebookId?: string | null; // Optional
  googleId?: string | null; // Optional
  appleId?: string | null; // Optional
}

export class AvgScore {
  @IsNotEmpty()
  @IsNumber()
  min: number;

  @IsNotEmpty()
  @IsNumber()
  max: number;
}

export class Stats {
  @IsNotEmpty()
  @IsString()
  yearStart: string;

  @IsNotEmpty()
  @IsNumber()
  handicap: number;

  @IsNotEmpty()
  @IsNumber()
  avgScore: number;
}

export class Tag {
  @IsNotEmpty()
  @IsString()
  tagId: string;

  @IsNotEmpty()
  @IsString()
  tagName: string;

  @IsNotEmpty()
  @IsString()
  url: string;

  @IsOptional()
  @IsString()
  etag?: string;
}

/**
 * Profile DTO
 * @description Profile DTO for transfer data in model layer
 */
export class Profile {
  @IsNotEmpty()
  @IsString()
  memberId: string;

  @IsString()
  profileImage: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsString()
  customUserId: string;

  @IsString()
  nickName: string;

  @IsNotEmpty()
  @IsString()
  ranking: string;

  @IsNotEmpty()
  @IsString()
  introduction: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsNotEmpty()
  @IsString()
  country?: string;

  @IsNotEmpty()
  @IsString({ each: true })
  tags: string[];

  @IsOptional()
  @IsBoolean()
  isInviteAble?: boolean;

  @ValidateNested()
  @Type(() => Stats)
  stats: Stats;

  @IsNotEmpty()
  @IsNumber()
  followersCount: number;

  @IsNotEmpty()
  @IsNumber()
  followingsCount: number;
}

/**
 * ProfileMain DTO
 * @description ProfileMain DTO for member profile
 */
export class ProfileMain {
  @IsNotEmpty()
  @IsString()
  memberId: string;

  @IsString()
  profileImage: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsString()
  customUserId: string;

  @IsString()
  nickName: string;

  @IsNotEmpty()
  @IsString()
  ranking: string;

  @IsNotEmpty()
  @IsString()
  introduction: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsNotEmpty()
  @IsString()
  country?: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => Tag)
  tags: Tag[];

  @IsOptional()
  @IsBoolean()
  isInviteAble?: boolean;

  @ValidateNested()
  @Type(() => Stats)
  stats: Stats;

  @IsNotEmpty()
  @IsNumber()
  followersCount: number;

  @IsNotEmpty()
  @IsNumber()
  followingsCount: number;
}

export class ProfileForSearch {
  @IsNotEmpty()
  @IsString()
  memberId: string;

  @IsString()
  profileImage: string;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  // @IsNotEmpty()
  // @IsString()
  // ranking: string;

  @IsNotEmpty()
  @IsString()
  introduction: string;

  // @IsNotEmpty()
  // @IsString()
  // location: string;

  // @IsNotEmpty()
  // @IsString()
  // country: string;

  // @IsNotEmpty()
  // @IsString({ each: true })
  // tags: string[];

  // @IsNotEmpty()
  // @IsBoolean()
  // isInviteAble: boolean;

  @IsEnum(FriendStatusEnum)
  status: FriendStatusEnum | null;
}
