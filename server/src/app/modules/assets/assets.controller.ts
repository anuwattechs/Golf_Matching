import {
  Controller,
  UploadedFile,
  Body,
  UseInterceptors,
  HttpException,
  Param,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { Get, Post } from '@nestjs/common';
import { ResponseMessage } from 'src/app/common/decorator/response-message.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/app/config/config.type';
import { CreateTagDto } from './dto/create-tag.dto';
import { JwtAuthGuard, BlockGuard } from '../auth/guard';

@Controller('assets')
export class AssetsController {
  constructor(
    private readonly assetsService: AssetsService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  /**
   * Uploads a file to a specified folder in S3
   * @param file - The uploaded file
   * @param folder - The folder where the file will be stored in S3
   * @param isPublic - Whether the file should be publicly accessible
   * @returns Upload result or error message
   */
  @Post('upload')
  // @UseGuards(BlockGuard)
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('assets.FILE_UPLOADED_SUCCESSFULLY')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({
            maxSize: 5 * 1024 * 1024, // 5MB limit
            message: 'File is too large. Max file size is 5MB',
          }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
    @Body('folder') folder: string,
    @Body('isPublic') isPublic: boolean,
  ) {
    if (!file) {
      throw new HttpException('File must be provided', 400);
    }

    if (!folder) {
      throw new HttpException('Folder must be specified', 400);
    }

    return await this.assetsService.uploadFile(file, folder, isPublic);
  }

  /**
   * Fetches all files from a specified folder in S3
   * @param folder - The folder to fetch files from
   * @returns An array of file objects
   */
  @Get('files/:folder')
  // @UseGuards(BlockGuard)
  @UseGuards(JwtAuthGuard)
  async getFiles(
    @Param('folder') folder: string,
  ): Promise<AWS.S3.ListObjectsV2Output> {
    if (!folder) {
      throw new HttpException('Folder must be specified', 400);
    }
    return this.assetsService.listFiles(folder);
  }

  /**
   * Deletes a file from a specified folder in S3
   * @param key - The key of the file to delete
   * @returns Deletion result or error message
   */
  @Post('delete')
  // @UseGuards(BlockGuard)
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('assets.FILE_DELETED_SUCCESSFULLY')
  async deleteFile(@Body('key') key: string) {
    if (!key) {
      throw new HttpException('Key must be specified', 400);
    }
    return this.assetsService.deleteFile(key);
  }

  /**
   * Downloads a file from S3
   * @param key - The key of the file to download
   * @returns The file to download
   */
  @Post('file')
  // @UseGuards(BlockGuard)
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('assets.FILE_DOWNLOADED_SUCCESSFULLY')
  async downloadFile(@Body('key') key: string) {
    if (!key) {
      throw new HttpException('Key must be specified', 400);
    }

    const fileStream = await this.assetsService.getPresignedSignedUrl(key);
    return {
      path: this.assetsService.getFileUrl(key),
      fileStream,
    };
  }

  /**
   * Fetches all buckets from S3 storage service
   * @returns An array of bucket objects
   */
  @Get('buckets')
  // @UseGuards(BlockGuard)
  @UseGuards(JwtAuthGuard)
  async getBuckets(): Promise<AWS.S3.ListBucketsOutput> {
    return this.assetsService.getBuckets();
  }

  /**
   * Creates a new tag in the S3 bucket
   * @param body - The tag object to create
   * @returns The created tag object
   */
  @Post('tags')
  // @UseGuards(BlockGuard)
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('assets.TAG_CREATED_SUCCESSFULLY')
  @UseInterceptors(FileInterceptor('file'))
  async createTag(
    @Body() body: CreateTagDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.assetsService.createTag(body, file, 'tags', true);
  }

  /**
   * Fetches available tags from the local assets directory
   * @returns An array of tag objects
   */
  @Get('tags')
  // @UseGuards(JwtAuthGuard)
  async getTags() {
    return this.assetsService.getTags({
      isPublic: false,
    });
  }

  /**
   * Updates a tag in the S3 bucket
   * @param id - The ID of the tag to update
   * @param body - The updated tag object
   * @returns The updated tag object
   */
  @Post('tags/:id')
  // @UseGuards(BlockGuard)
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('assets.TAG_UPDATED_SUCCESSFULLY')
  @UseInterceptors(FileInterceptor('file'))
  async updateTag(
    @Param('id') id: string,
    @Body('tagName') body: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({
            maxSize: 5 * 1024 * 1024, // 5MB limit
            message: 'File is too large. Max file size is 5MB',
          }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.assetsService.updateTag(id, body, file);
  }

  /**
   * Deletes a tag from the S3 bucket
   * @param id - The ID of the tag to delete
   * @returns Deletion result or error message
   */
  @Delete('tags/:id')
  // @UseGuards(BlockGuard)
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('assets.TAG_DELETED_SUCCESSFULLY')
  async deleteTag(@Param('id') id: string) {
    return this.assetsService.deleteTag(id);
  }
}
