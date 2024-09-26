import { IsNotEmpty, IsString, IsIn, Matches } from 'class-validator';

export class UpdatePersonalInfoDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, {
    message: 'Date of birth must be in the format YYYY-MM-DD',
  })
  date_of_birth: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['MALE', 'FEMALE'])
  gender: string;

  //   @ValidateIf(
  //     (object) => object.phone_number == null || object.phone_number == '',
  //   )
  // @IsEmail()
  // @IsNotEmpty()
  // email: string;

  //   @ValidateIf((object) => object.email == null || object.email == '')
  //   @IsString()
  //   @IsNotEmpty()
  //   phone_number: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  nick_name: string;
  occupation: string;
  lifestyle: string[];
  started_golf: number;
  avg_score: number;
  favorite_course: string;
  holes_in_one: number;
  best_score: number;
  clubs: string;
  introduction: string;
}
