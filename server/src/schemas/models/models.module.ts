import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MemberModel,
  VerificationCodesModel,
  GolfCourseModel,
  TagModel,
  MatchPlayerModel,
  MatchRequestModel,
  MatchesModel,
} from '.';
import {
  Member,
  MemberSchema,
  VerificationCode,
  VerificationCodeSchema,
  GolfCourse,
  GolfCourseSchema,
  Tag,
  TagSchema,
  Matches,
  MatchesSchema,
  MatchRequest,
  MatchRequestSchema,
  MatchPlayer,
  MatchPlayerSchema,
} from 'src/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Member.name,
        schema: MemberSchema,
      },
      {
        name: VerificationCode.name,
        schema: VerificationCodeSchema,
      },
      {
        name: GolfCourse.name,
        schema: GolfCourseSchema,
      },
      {
        name: Tag.name,
        schema: TagSchema,
      },
      {
        name: Matches.name,
        schema: MatchesSchema,
      },
      {
        name: MatchRequest.name,
        schema: MatchRequestSchema,
      },
      {
        name: MatchPlayer.name,
        schema: MatchPlayerSchema,
      },
    ]),
  ],
  providers: [
    MemberModel,
    VerificationCodesModel,
    GolfCourseModel,
    TagModel,
    MatchPlayerModel,
    MatchRequestModel,
    MatchesModel,
  ],
  exports: [
    MemberModel,
    VerificationCodesModel,
    GolfCourseModel,
    TagModel,
    MatchPlayerModel,
    MatchRequestModel,
    MatchesModel,
  ],
})
export class ModelsModule {}
