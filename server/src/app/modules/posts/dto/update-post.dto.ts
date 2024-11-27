import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsEnum,
  IsOptional,
  // ValidateNested,
} from 'class-validator';
// import { Type } from 'class-transformer';
import { /*MediaTypeEnum,*/ PostPrivacyEnum } from 'src/shared/enums';

// export class MediaDto {
//   @IsString()
//   @IsNotEmpty()
//   etag: string;

//   @IsString()
//   @IsNotEmpty()
//   key: string;

//   @IsEnum(MediaTypeEnum)
//   @IsNotEmpty()
//   type: MediaTypeEnum;
// }

export class UpdatePostDto {
  @IsUUID()
  @IsNotEmpty()
  postId: string;

  @IsOptional()
  @IsString()
  caption?: string;

  // @ValidateNested({ each: true })
  // @Type(() => MediaDto)
  // media: MediaDto[];

  @IsOptional()
  @IsString({ each: true })
  hashtags?: string[];

  @IsOptional()
  @IsEnum(PostPrivacyEnum)
  privacy?: PostPrivacyEnum;
}
