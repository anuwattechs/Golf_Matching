import { Type } from "class-transformer";
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  ValidateIf,
  ValidateNested,
  Min,
} from "class-validator";
import { GenderEnum, HoleTypeEnum } from "src/shared/enums";
import { AddressDto, ResScoreCardsShortDto } from ".";
import { Transform } from "class-transformer";
import { ResultPaginationDto } from "src/shared/dto";
import { MatchesTypeEnum } from "src/shared/enums";

export class CreateMatchDto {
  @IsString()
  @IsOptional()
  title: string;

  @ValidateIf((o) => o.matchesType === MatchesTypeEnum.GROUP)
  @IsString()
  @IsOptional() // Description can be optional, even if conditionally validated
  description: string;

  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsOptional()
  discussionId: string;

  @IsDateString()
  @IsNotEmpty()
  datetime: Date;

  @IsEnum(HoleTypeEnum)
  @IsNotEmpty()
  holeType: HoleTypeEnum;

  @IsEnum(MatchesTypeEnum)
  @IsNotEmpty()
  matchesType: MatchesTypeEnum;

  @IsOptional()
  @IsString() // URL or file name in case it's already stored in the server
  coverImageUrl?: string;

  @ValidateIf((o) => o.matchesType === MatchesTypeEnum.GROUP)
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => parseFloat(value))
  costPerPerson: number;

  @ValidateIf((o) => o.matchesType === MatchesTypeEnum.GROUP)
  @IsString()
  handicap: string;

  @ValidateIf((o) => o.matchesType === MatchesTypeEnum.GROUP)
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  avgScore: number;

  @ValidateIf((o) => o.matchesType === MatchesTypeEnum.GROUP)
  @IsEnum(["NS", "YES", "NO"])
  useGolfCart: string;

  @ValidateIf((o) => o.matchesType === MatchesTypeEnum.GROUP)
  @IsNumber()
  @Min(2)
  @Transform(({ value }) => parseFloat(value))
  maxPlayers: number;

  @ValidateIf((o) => o.matchesType === MatchesTypeEnum.GROUP)
  @IsString()
  tags: string;

  @ValidateIf((o) => o.matchesType === MatchesTypeEnum.GROUP)
  @IsEnum(GenderEnum)
  gender: GenderEnum;
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
  avgScore?: number;

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

// for calculating golf scores
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

// for paginating the matches history
export class ResMatchesHistoryDto {
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
  datetime: Date;

  @IsEnum(["SOLO", "GROUP"])
  @IsNotEmpty()
  matchType: string;

  @IsNumber()
  @IsNotEmpty()
  maxPlayers: number;

  @IsNumber()
  @IsNotEmpty()
  currentPlayers: number;

  @ValidateNested()
  @Type(() => ResScoreCardsShortDto)
  score: ResScoreCardsShortDto;

  @IsEnum(["LIVE", "ENDED"])
  @IsNotEmpty()
  matchStatus: string;
}

export class ResultPaginationMatchesHistoryDto extends ResultPaginationDto<ResMatchesHistoryDto> {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResMatchesHistoryDto)
  result: ResMatchesHistoryDto[];
}
