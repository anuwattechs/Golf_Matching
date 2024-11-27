import {
  Controller,
  Post,
  Get,
  Put,
  // UploadedFile,
  UploadedFiles,
  Body,
  UseInterceptors,
  // HttpException,
  // Param,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ResponseMessage } from 'src/app/common/decorator/response-message.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard /*, BlockGuard*/ } from '../auth/guard';
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto, DeletePostDto } from './dto';
import { JwtPayloadType } from '../auth/strategies/types';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  // @UseGuards(BlockGuard)
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('post.POST_CREATED_SUCCESSFULLY')
  @UseInterceptors(FilesInterceptor('files'))
  create(
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

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('post.FETCHED_ALL_POSTS_SUCCESSFULLY')
  findAll(@Req() req: Request & { decoded: JwtPayloadType }) {
    return this.postsService.findAll(req.decoded);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('post.POST_UPDATED_SUCCESSFULLY')
  update(@Body() body: UpdatePostDto) {
    return this.postsService.update(body);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('post.POST_DELETED_SUCCESSFULLY')
  delete(@Body() query: DeletePostDto) {
    return this.postsService.delete(query);
  }
}
