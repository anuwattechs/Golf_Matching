import {
  Controller,
  Post,
  // UploadedFile,
  UploadedFiles,
  Body,
  UseInterceptors,
  // HttpException,
  // Param,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  // Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
// import { AssetsService } from './assets.service';
import { ResponseMessage } from 'src/app/common/decorator/response-message.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
// import { ConfigService } from '@nestjs/config';
// import { AllConfigType } from 'src/app/config/config.type';
// import { CreateTagDto } from './dto/create-tag.dto';
import { JwtAuthGuard /*, BlockGuard*/ } from '../auth/guard';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto';
import { JwtPayloadType } from '../auth/strategies/types';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  // @UseGuards(BlockGuard)
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('post.POST_CREATED_SUCCESSFULLY')
  // @UseInterceptors(FileInterceptor('file'))
  @UseInterceptors(FilesInterceptor('files'))
  create(
    // @Param('id') id: string,
    @Body() body: CreatePostDto,
    @Req() req: Request & { decoded: JwtPayloadType },
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/*|video/*' }),
          new MaxFileSizeValidator({
            maxSize: 15 * 1024 * 1024, // 5MB limit
            message: 'File is too large. Max file size is 15MB',
          }),
        ],
        fileIsRequired: true,
      }),
    )
    files: Array<Express.Multer.File>,
  ) {
    // return { body, files };
    return this.postsService.create(body, req.decoded, files);
  }
}
