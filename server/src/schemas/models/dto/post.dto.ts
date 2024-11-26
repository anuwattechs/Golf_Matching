import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsEnum,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MediaTypeEnum, PostDisplayEnum } from 'src/shared/enums';

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

  @IsOptional()
  @IsString()
  caption?: string;

  @ValidateNested({ each: true })
  @Type(() => MediaDto)
  media: MediaDto[];

  @IsOptional()
  @IsUUID()
  tags?: string[];

  @IsOptional()
  @IsEnum(PostDisplayEnum)
  display?: PostDisplayEnum;
}
