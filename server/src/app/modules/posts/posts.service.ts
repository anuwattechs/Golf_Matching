import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { JwtPayloadType } from '../auth/strategies/types';
import { CreatePostDto } from './dto';
import { NullableType } from 'src/shared/types';
import { AwsService } from 'src/app/common/services/aws/aws.service';
import { PostModel } from 'src/schemas/models';

@Injectable()
export class PostsService {
  constructor(
    private readonly postModel: PostModel,
    private readonly awsService: AwsService,
  ) {}

  async create(
    body: CreatePostDto,
    decoded: JwtPayloadType,
    files: Array<Express.Multer.File>,
  ): Promise<NullableType<unknown>> {
    try {
      return { body, decoded, files };
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
