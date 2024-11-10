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
  GolfCourseLayoutModel,
  HoleScoresModel,
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
  GolfCoursesLayouts,
  GolfCoursesLayoutsSchema,
  HoleScores,
  HoleScoresSchema,
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
      {
        name: GolfCoursesLayouts.name,
        schema: GolfCoursesLayoutsSchema,
      },
      {
        name: HoleScores.name,
        schema: HoleScoresSchema,
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
    GolfCourseLayoutModel,
    HoleScoresModel,
  ],
  exports: [
    MemberModel,
    VerificationCodesModel,
    GolfCourseModel,
    TagModel,
    MatchPlayerModel,
    MatchRequestModel,
    MatchesModel,
    GolfCourseLayoutModel,
    HoleScoresModel,
  ],
})
export class ModelsModule {}
