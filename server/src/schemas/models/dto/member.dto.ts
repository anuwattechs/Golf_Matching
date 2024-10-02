import { GenderEnum, AuthProvidersEnum } from 'src/shared/enums';

export class CreateMemberDto {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: GenderEnum;
  email: string;
  password: string;
  country: string;
  location: string;
  nickName?: string;
  occupation?: string;
  lifestyle?: string[];
  startedGolf?: number;
  avgScore?: number;
  favoriteCourse?: string;
  holesInOne?: number;
  bestScore?: number;
  clubs?: string;
}

export class UpdateMemberDto {
  memberId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: GenderEnum;
  country: string;
  location: string;
  nickName?: string;
  occupation?: string;
  lifestyle?: string[];
  startedGolf?: number;
  avgScore?: number;
  favoriteCourse?: string;
  holesInOne?: number;
  bestScore?: number;
  clubs?: string;
  introduction?: string;
}

export class CreateMemberBySocialDto {
  firstName: string;
  lastName: string;
  email: string;
  socialId: string;
  provider: AuthProvidersEnum;
}
