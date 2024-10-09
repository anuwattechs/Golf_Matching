import { IsNotEmpty, IsString } from 'class-validator';

export class UploadDto {
  @IsNotEmpty()
  file: Express.Multer.File;

  @IsString()
  folder: string;
}
