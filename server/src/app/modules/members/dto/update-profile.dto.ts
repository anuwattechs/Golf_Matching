import { IsNotEmpty, IsString, IsEnum, Matches } from 'class-validator';
import { GenderEnum } from 'src/shared/enums';

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsNotEmpty()
  @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, {
    message: 'Date of birth must be in the format YYYY-MM-DD',
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

  nickName: string;
  occupation: string;
  tags: string[];
  yearStart: string;
  avgScore: number;
  favoriteCourses: string[];
  countHoleInOne: number;
  bestScore: number;
  clubBrands: string;
  introduction: string;
}
