import { GenderEnum, AuthTypeEnum } from 'src/shared/enums';

export class CreateMemberDto {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: GenderEnum;
  username: string;
  password: string;
  country: string;
  location: string;
  nickName?: string;
  occupation?: string;
  tags?: string[];
  yearStart?: string;
  avgScore?: number;
  favoriteCourses?: string[];
  countHoleInOne?: number;
  bestScore?: number;
  clubBrands?: string;
}

export class UpdateMemberDto {
  userId: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: GenderEnum;
  country: string;
  location: string;
  nickName?: string;
  occupation?: string;
  tags?: string[];
  yearStart?: string;
  avgScore?: number;
  favoriteCourses?: string[];
  countHoleInOne?: number;
  bestScore?: number;
  clubBrands?: string;
  introduction?: string;
}

export class CreateMemberBySocialDto {
  firstName: string;
  lastName: string;
  username: string;
  socialId: string;
  authType: AuthTypeEnum;
}

export class FindBySocialIdDto {
  socialId: string;
  authType: AuthTypeEnum;
}
