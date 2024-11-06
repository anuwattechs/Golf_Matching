import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  MemberModel,
  VerificationCodesModel,
  GolfCourseModel,
  TagModel,
  GalleryModel,
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
        name: Gallery.name,
        schema: GallerySchema,
      },
    ]),
  ],
  providers: [
    MemberModel,
    VerificationCodesModel,
    GolfCourseModel,
    TagModel,
    GalleryModel,
  ],
  exports: [
    MemberModel,
    VerificationCodesModel,
    GolfCourseModel,
    TagModel,
    GalleryModel,
  ],
})
export class ModelsModule {}
