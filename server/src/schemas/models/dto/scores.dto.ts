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
