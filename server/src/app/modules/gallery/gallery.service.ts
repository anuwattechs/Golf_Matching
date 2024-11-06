import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { GalleryModel } from 'src/schemas/models';
import { JwtPayloadType } from '../auth/strategies/types';
import { FindGalleryDto } from './dto';

@Injectable()
export class GalleryService {
  constructor(private readonly galleryModel: GalleryModel) {}

  async uploadFile(file: Express.Multer.File, decoded: JwtPayloadType) {
    try {
    } catch (error) {
      this.handleException(error);
    }
  }

  async delete(input: FindGalleryDto) {
    try {
      return await this.galleryModel.deleteById(input.galleryId);
    } catch (error) {
      this.handleException(error);
    }
  }

  private handleException(error: any): void {
    throw new HttpException(
      {
        status: false,
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        data: null,
      },
      error.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
