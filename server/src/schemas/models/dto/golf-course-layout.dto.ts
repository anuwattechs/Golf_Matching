import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateGolfCourseLayoutDto {
  @IsString()
  @IsNotEmpty()
  golfCourseId: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateHoleDto)
  holes: CreateHoleDto[];
}

export class CreateHoleDto {
  @IsString()
  @IsNotEmpty()
  hole: string;

  @IsNumber()
  @IsNotEmpty()
  par: number;

  @IsNumber()
  @IsOptional()
  yardage: number;
}
