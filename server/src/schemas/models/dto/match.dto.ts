import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { GenderEnum } from 'src/shared/enums';

export class CreateMatchDto {
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

  @IsEnum(['SOLO', 'GROUP'])
  @IsNotEmpty()
  matchesType: string;

  @IsString()
  @IsOptional()
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
  @IsNotEmpty()
  maxPlayers: number;

  @IsArray()
  @IsOptional()
  tags: string[];

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

  @IsEnum(['SOLO', 'GROUP'])
  @IsOptional()
  matchesType?: string;

  @IsString()
  @IsOptional()
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
