import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { JwtPayloadType } from '../auth/strategies/types';
import { CreatePostDto, UpdatePostDto, DeletePostDto } from './dto';
import { NullableType } from 'src/shared/types';
import { AwsService } from 'src/app/common/services/aws/aws.service';
import { PostModel } from 'src/schemas/models';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/app/config/config.type';

@Injectable()
export class PostsService {
  constructor(
    private readonly postModel: PostModel,
    private readonly awsService: AwsService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  async create(
    body: CreatePostDto,
    decoded: JwtPayloadType,
    files: Array<Express.Multer.File>,
  ): Promise<NullableType<unknown>> {
    try {
      const bucketName = this.configService.get<string>(
        'assets.awsDefaultS3Bucket',
        { infer: true },
      );
      const now = Date.now();
      const folder = 'posts';
      const uploadFiles = files.map((file) => {
        return this.awsService.uploadFile(
          bucketName,
          `${folder}/${now}-${file.originalname}`,
          file.buffer,
          file.mimetype,
        );
      });
      const uploaded = await Promise.all(uploadFiles);

      const inserted = await this.postModel.create({
        ...body,
        memberId: decoded.userId,
        media: uploaded.map((file, index) => ({
          // etag: file.ETag,
          key: file.Key,
          type: files[index].mimetype,
        })),
      });

      return inserted;
    } catch (error) {
      this.handleException(error);
    }
  }

  async update(body: UpdatePostDto): Promise<NullableType<unknown>> {
    try {
      const updated = await this.postModel.update({
        ...body,
      });

      return updated;
    } catch (error) {
      this.handleException(error);
    }
  }

  async delete(query: DeletePostDto): Promise<NullableType<unknown>> {
    try {
      const deleted = await this.postModel.deleteById(query.postId);

      return deleted;
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
