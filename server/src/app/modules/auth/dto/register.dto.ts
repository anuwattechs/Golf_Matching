import { IsNotEmpty, IsString, IsEnum, Matches } from 'class-validator';
import { GenderEnum } from 'src/shared/enums';

export class RegisterDto {
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
  dateOfBirth: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  nickName: string;
  occupation: string;
  lifestyle: string[];
  startedGolf: number;
  avgScore: number;
  favoriteCourse: string;
  holesInOne: number;
  bestScore: number;
  clubs: string;
}
