import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateHoleScoresDto {
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

export class UpdateHoleScoresDto {
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
