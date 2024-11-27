import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { PostPrivacyEnum } from 'src/shared/enums';

export class UpdatePostDto {
  @IsUUID()
  @IsNotEmpty()
  postId: string;

  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsString({ each: true })
  hashtags?: string[];

  @IsOptional()
  @IsEnum(PostPrivacyEnum)
  privacy?: PostPrivacyEnum;
}
