import { IsUUID, IsNotEmpty } from 'class-validator';

export class FindGalleryDto {
  @IsUUID()
  @IsNotEmpty()
  galleryId: string;
}
