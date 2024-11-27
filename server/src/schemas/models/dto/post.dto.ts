import { MediaTypeEnum, PostPrivacyEnum } from 'src/shared/enums';

export class MediaDto {
  etag: string;
  key: string;
  type: MediaTypeEnum;
}

export class CreatePostDto {
  memberId: string;
  caption?: string;
  media: MediaDto[];
  hashtags?: string[];
  privacy?: PostPrivacyEnum;
}

export class UpdatePostDto {
  postId: string;
  caption?: string;
  hashtags?: string[];
}
