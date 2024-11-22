import { Type } from "class-transformer";
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
} from "class-validator";
import { GenderEnum } from "src/shared/enums";
import { AddressDto } from ".";
import { ResultPaginationDto } from "src/shared/dto";

export class CreateMatchDto {
  @ValidateIf((o) => o.matchesType === "SOLO")
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

  @IsString()
  @IsNotEmpty()
  date: Date; // example: 2021-09-01T00:00:00.000Z

  @IsEnum(["SOLO", "GROUP"])
  @IsNotEmpty()
  matchesType: string;

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

  @ValidateIf((o) => o.matchesType === "GROUP")
  @IsArray()
  @IsOptional()
  tags: string[];

  @ValidateIf((o) => o.matchesType === "GROUP")
  @IsEnum(GenderEnum)
  @IsOptional()
  gender?: GenderEnum;
}

export class UpdateMatchDto {
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

  @IsDate()
  @IsOptional()
  date?: Date;

  @IsEnum(["SOLO", "GROUP"])
  @IsOptional()
  matchesType?: string;

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
  @IsString()
  @IsNotEmpty()
  matchId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
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

  @IsString()
  @IsNotEmpty()
  date: Date;

  @IsEnum(["SOLO", "GROUP"])
  @IsNotEmpty()
  matchType: string;

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
