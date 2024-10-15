import { GenderEnum } from 'src/shared/enums';

export class CreateMemberDto {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: GenderEnum;
  username: string; // Optional or required based on your application logic
  password: string; // Required
  country: string;
  location: string;
  nickName?: string; // Optional
  occupation?: string; // Optional
  tags?: string[]; // Optional
  yearStart?: string; // Optional
  avgScore?: number; // Optional
  favoriteCourses?: string[]; // Optional
  countHoleInOne?: number; // Optional
  bestScore?: number; // Optional
  clubBrands?: string; // Optional
}

export class UpdateMemberDto {
  userId: string; // Required
  firstName?: string; // Optional, in case of partial updates
  lastName?: string; // Optional, in case of partial updates
  birthDate?: string; // Optional, in case of partial updates
  gender?: GenderEnum; // Optional, in case of partial updates
  country?: string; // Optional
  location?: string; // Optional
  nickName?: string; // Optional
  occupation?: string; // Optional
  tags?: string[]; // Optional
  yearStart?: string; // Optional
  avgScore?: number; // Optional
  favoriteCourses?: string[]; // Optional
  countHoleInOne?: number; // Optional
  bestScore?: number; // Optional
  clubBrands?: string; // Optional
  introduction?: string; // Optional
}

export class CreateMemberBySocialDto {
  firstName: string;
  lastName: string;
  email?: string; // Optional, in case the email is needed for registration
  facebookId?: string; // Optional, for linking accounts
  googleId?: string; // Optional, for linking accounts
  appleId?: string; // Optional, for linking accounts
}

export class FindBySocialIdDto {
  facebookId?: string | null; // Optional
  googleId?: string | null; // Optional
  appleId?: string | null; // Optional
}
