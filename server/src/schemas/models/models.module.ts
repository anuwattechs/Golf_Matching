import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MemberModel,
  VerificationCodesModel,
  GolfCourseModel,
  TagModel,
  GalleryModel,
  MatchPlayerModel,
  MatchRequestModel,
  MatchesModel,
  GolfCourseLayoutModel,
  ScoresModel,
  MemberSettingsModel,
  FriendsModel,
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
  Gallery,
  GallerySchema,
  Matches,
  MatchesSchema,
  MatchRequest,
  MatchRequestSchema,
  MatchPlayer,
  MatchPlayerSchema,
  GolfCoursesLayouts,
  GolfCoursesLayoutsSchema,
  Scores,
  ScoresSchema,
  MemberSettings,
  MemberSettingsSchema,
  Friends,
  FriendsSchema,
} from 'src/schemas';
import { UtilsModule } from 'src/shared/utils/utils.module';
import { UtilsService } from 'src/shared/utils/utils.service';

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
        name: Gallery.name,
        schema: GallerySchema,
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
        name: Scores.name,
        schema: ScoresSchema,
      },
      {
        name: MemberSettings.name,
        schema: MemberSettingsSchema,
      },
      {
        name: Friends.name,
        schema: FriendsSchema,
      },
      {
        name: Matches.name,
        schema: MatchesSchema,
      },
    ]),
  ],
  providers: [
    MemberModel,
    VerificationCodesModel,
    GolfCourseModel,
    TagModel,
    GalleryModel,
    MatchPlayerModel,
    MatchRequestModel,
    MatchesModel,
    GolfCourseLayoutModel,
    ScoresModel,
    MemberSettingsModel,
    FriendsModel,
    UtilsService,
  ],
  exports: [
    MemberModel,
    VerificationCodesModel,
    GolfCourseModel,
    TagModel,
    GalleryModel,
    MatchPlayerModel,
    MatchRequestModel,
    MatchesModel,
    GolfCourseLayoutModel,
    ScoresModel,
    MemberSettingsModel,
    FriendsModel,
  ],
})
export class ModelsModule {}
