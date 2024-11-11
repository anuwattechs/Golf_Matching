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
  MemberSettingsModel,
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
  MemberSettings,
  MemberSettingsSchema,
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
      {
        name: MemberSettings.name,
        schema: MemberSettingsSchema,
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
    MemberSettingsModel,
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
    MemberSettingsModel,
  ],
})
export class ModelsModule {}
