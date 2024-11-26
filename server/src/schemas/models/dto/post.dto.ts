import { IsNotEmpty, IsString, IsUUID, IsEnum } from 'class-validator';
import { MediaTypeEnum } from 'src/shared/enums';

export class MediaDto {
  @IsString()
  @IsNotEmpty()
  etag: string;

  @IsString()
  @IsNotEmpty()
  key: string;

  @IsEnum(MediaTypeEnum)
  @IsNotEmpty()
  type: MediaTypeEnum;
}

export class CreatePostDto {
  @IsUUID()
  @IsNotEmpty()
  memberId: string;

  caption: string;
  key: string;
  createdBy: string;
}
