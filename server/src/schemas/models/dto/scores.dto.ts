import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { AddressDto } from './golf-course.dto';
import { ResultPaginationDto } from 'src/shared/dto';

export class CreateScoresDto {
  @IsNotEmpty()
  @IsString()
  matchId: string;

  @IsNotEmpty()
  @IsString()
  golfCourseLayoutId: string;

  @IsNotEmpty()
  @IsString()
  playerId: string;

  @IsNotEmpty()
  @IsNumber()
  hole: number;

  @IsNotEmpty()
  @IsNumber()
  strokes: number;

  @IsNotEmpty()
  @IsNumber()
  putts: number;

  @IsNotEmpty()
  @IsNumber()
  chipIns: number;

  @IsArray()
  @IsString({ each: true })
  caddieIds: string[];
}

export class UpdateScoresDto {
  @IsNotEmpty()
  @IsString()
  matchId: string;

  @IsNotEmpty()
  @IsString()
  golfCourseLayoutId: string;

  @IsNotEmpty()
  @IsString()
  playerId: string;

  @IsNotEmpty()
  @IsNumber()
  hole: number;

  @IsNotEmpty()
  @IsNumber()
  strokes: number;

  @IsNotEmpty()
  @IsNumber()
  putts: number;

  @IsNotEmpty()
  @IsNumber()
  chipIns: number;

  @IsArray()
  @IsString({ each: true })
  caddieIds: string[];
}

/**
 * Represents a score card for calculating golf scores.
 * @category DTO
 * @class ScoreCardDto
 */
export class ScoreCardDto {
  @IsNotEmpty()
  @IsString()
  matchId: string;

  @IsNotEmpty()
  @IsString()
  playerId: string;

  @IsString()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  courseName: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsNumber()
  @IsNotEmpty()
  maxPlayers: number;

  @IsNumber()
  @IsNotEmpty()
  myScore: number;

  @IsNumber()
  @IsNotEmpty()
  overScore: number;

  @IsNumber()
  @IsNotEmpty()
  fairways: number;

  @IsNumber()
  @IsNotEmpty()
  puttsRound: number;

  @IsNumber()
  @IsNotEmpty()
  puttsHole: number;
}

/**
 * Represents a score card for response. This is a DTO.
 * @category DTO
 * @class ResScoreCard
 */
export class ResScoreCardDto {
  @IsNotEmpty()
  @IsString()
  matchId: string;

  @IsNotEmpty()
  @IsString()
  playerId: string;

  @IsString()
  @IsNotEmpty()
  date: Date;

  @IsString()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  courseName: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsNumber()
  @IsNotEmpty()
  maxPlayers: number;

  @IsString()
  @IsNotEmpty()
  myScore: String;

  @IsString()
  @IsNotEmpty()
  overScore: String;

  @IsString()
  @IsNotEmpty()
  fairways: String;

  @IsString()
  @IsNotEmpty()
  puttsRound: String;

  @IsString()
  @IsNotEmpty()
  puttsHole: String;
}

export class ResultsPaginatedScoreCardsDto extends ResultPaginationDto<ResScoreCardDto> {
  @ValidateNested()
  @Type(() => ResScoreCardDto)
  result: ResScoreCardDto[];
}
