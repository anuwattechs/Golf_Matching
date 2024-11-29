import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
  IsDateString,
  IsUUID,
} from 'class-validator';
import { GenderEnum } from 'src/shared/enums';
import { AddressDto } from '.';
import { ResultPaginationDto } from 'src/shared/dto';
import { MatchesTypeEnum } from 'src/shared/enums';

export class CreateMatchDto {
  @ValidateIf((o) => o.matchesType === MatchesTypeEnum.SOLO)
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsOptional()
  discussionId: string; // for chat and comments on the match

  @IsDateString()
  @IsNotEmpty()
  date: Date; // example: 2021-09-01T00:00:00.000Z

  @IsEnum(MatchesTypeEnum)
  @IsNotEmpty()
  matchesType: MatchesTypeEnum;

  @IsString()
  @IsOptional()
  coverImageUrl?: File;

  @IsNumber()
  @IsOptional()
  costPerPerson?: number;

  @IsString()
  @IsOptional()
  handicap?: string;

  @IsNumber()
  @IsOptional()
  averageScore?: number;

  @IsString()
  @IsOptional()
  transportMode?: string;

  @IsNumber()
  @IsNotEmpty()
  maxPlayers: number;

  @ValidateIf((o) => o.matchesType === MatchesTypeEnum.GROUP)
  @IsArray()
  @IsOptional()
  tags: string[];

  @ValidateIf((o) => o.matchesType === MatchesTypeEnum.GROUP)
  @IsEnum(GenderEnum)
  @IsOptional()
  gender?: GenderEnum;
}

export class UpdateMatchDto {
  @IsUUID()
  @IsNotEmpty()
  matchId: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  courseId?: string;

  @IsDateString()
  @IsOptional()
  date?: Date;

  @IsEnum(MatchesTypeEnum)
  @IsOptional()
  matchesType?: MatchesTypeEnum;

  coverImageUrl?: string;

  @IsNumber()
  @IsOptional()
  costPerPerson?: number;

  @IsString()
  @IsOptional()
  handicap?: string;

  @IsNumber()
  @IsOptional()
  averageScore?: number;

  @IsString()
  @IsOptional()
  transportMode?: string;

  @IsNumber()
  @IsOptional()
  maxPlayers?: number;

  @IsString()
  @IsOptional()
  createdBy?: string;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsEnum(GenderEnum)
  @IsOptional()
  gender: GenderEnum;
}

export class MatchesHistoryDto {
  @IsUUID()
  @IsNotEmpty()
  matchId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUUID()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  courseName: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsString()
  @IsNotEmpty()
  coverImageUrl: string;

  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsEnum(MatchesTypeEnum)
  @IsNotEmpty()
  matchesType: MatchesTypeEnum;

  @IsNumber()
  @IsNotEmpty()
  maxPlayers: number;

  @IsNumber()
  @IsNotEmpty()
  currentPlayers: number;

  @IsNumber()
  @IsNotEmpty()
  myScore: number;
}

export class ResultPaginationMatchesHistoryDto extends ResultPaginationDto<MatchesHistoryDto> {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MatchesHistoryDto)
  result: MatchesHistoryDto[];
}
