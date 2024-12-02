import {
  IsString,
  IsNotEmpty,
  Matches,
  IsEnum,
  IsOptional,
  IsArray,
  IsNumber,
} from "class-validator";
import { GenderEnum } from "src/shared/enums";

/**
 * Data Transfer Object for updating user profile
 */
export class UpdateProfileDto {
  // Required Fields
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, {
    message: "Date of birth must be in the format YYYY-MM-DD",
  })
  birthDate: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  // Optional Basic Info
  @IsOptional()
  @IsString()
  nickName?: string;

  @IsOptional()
  @IsString()
  occupation?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsString()
  yearStart?: string;

  // Optional Golf-Related Info
  @IsOptional()
  @IsNumber()
  avgScore?: number;

  @IsOptional()
  @IsArray()
  favoriteCourses?: string[];

  @IsOptional()
  @IsNumber()
  countHoleInOne?: number;

  @IsOptional()
  @IsNumber()
  bestScore?: number;

  @IsOptional()
  @IsString()
  clubBrands?: string;

  @IsOptional()
  @IsString()
  introduction?: string;
}
