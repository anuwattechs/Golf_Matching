import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';
import { PostPrivacyEnum } from 'src/shared/enums';

export class CreatePostDto {
  @IsOptional()
  @IsString()
  caption?: string;

  @IsOptional()
  @IsString({ each: true })
  hashtags?: string[];

  @IsNotEmpty()
  @IsEnum(PostPrivacyEnum)
  privacy?: PostPrivacyEnum;
}
