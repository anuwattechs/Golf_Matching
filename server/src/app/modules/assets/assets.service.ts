import { HttpException, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/app/config/config.type';
import { CreateTagDto } from './dto';
import { TagModel } from 'src/schemas/models/tag.model';
import { UtilsService } from 'src/shared/utils/utils.service';

@Injectable()
export class AssetsService {
  private readonly s3: AWS.S3;
  private readonly BUCKET_NAME: string;

  /**
   * The constructor initializes an AWS S3 client with configuration values obtained from the
   * ConfigService.
   * @param configService - The `configService` parameter is of type `ConfigService<AllConfigType>`. It
   * is used to retrieve configuration values for the application.
   * @param {TagModel} tagModel - The `tagModel` parameter in the constructor is an instance of the
   * `TagModel` class. It is being injected into the constructor using dependency injection. This allows
   * the class to interact with the `TagModel` instance to perform operations related to tags, such as
   * creating, updating, or deleting tags
   */
  constructor(
    private readonly utilsService: UtilsService,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly tagModel: TagModel,
  ) {
    this.s3 = new AWS.S3({
      accessKeyId: this.getConfig('assets.accessKeyId'),
      secretAccessKey: this.getConfig('assets.secretAccessKey'),
    });
    this.BUCKET_NAME = this.getConfig('assets.awsDefaultS3Bucket');
  }

  /**
   * Get config value from environment
   */
  private getConfig(key: string): string {
    const value = this.configService.get<string>(key, { infer: true });
    if (!value)
      throw new Error(
        `${this.utilsService.getMessagesTypeSafe('assets.MISSING_CONFIG_KEY:')} ${key}`,
      );
    return value;
  }

  /**
   * Get all bucket names from S3
   */
  async getBuckets(): Promise<AWS.S3.ListBucketsOutput> {
    return this.s3Operation(
      () => this.s3.listBuckets().promise(),
      this.utilsService.getMessagesTypeSafe('assets.ERROR_LISTING_BUCKETS'),
    );
  }

  /**
   * Uploads a file to S3 and returns the result
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string,
    isPublic: boolean = false,
  ): Promise<AWS.S3.ManagedUpload.SendData> {
    const uploadParams: AWS.S3.PutObjectRequest = {
      Bucket: this.BUCKET_NAME,
      Key: `${folder}/${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    return this.s3Operation(
      () => this.s3.upload(uploadParams).promise(),
      this.utilsService.getMessagesTypeSafe('assets.ERROR_UPLOADING_FILE'),
    );
  }

  /**
   * Deletes a file from S3
   */
  async deleteFile(key: string): Promise<AWS.S3.DeleteObjectOutput> {
    const deleteParams: AWS.S3.DeleteObjectRequest = {
      Bucket: this.BUCKET_NAME,
      Key: key,
    };

    return this.s3Operation(
      () => this.s3.deleteObject(deleteParams).promise(),
      this.utilsService.getMessagesTypeSafe('assets.ERROR_DELETING_FILE'),
    );
  }

  /**
   * Downloads a file from S3
   */
  async downloadFile(key: string): Promise<AWS.S3.GetObjectOutput> {
    const downloadParams: AWS.S3.GetObjectRequest = {
      Bucket: this.BUCKET_NAME,
      Key: key,
    };

    return this.s3Operation(
      () => this.s3.getObject(downloadParams).promise(),
      this.utilsService.getMessagesTypeSafe('assets.ERROR_DOWNLOADING_FILE'),
    );
  }

  /**
   * List files in a specific folder in S3
   */
  async listFiles(folder: string): Promise<AWS.S3.ListObjectsV2Output> {
    const listParams: AWS.S3.ListObjectsV2Request = {
      Bucket: this.BUCKET_NAME,
      Prefix: folder,
    };

    return this.s3Operation(
      () => this.s3.listObjectsV2(listParams).promise(),
      this.utilsService.getMessagesTypeSafe('assets.ERROR_LISTING_FILES'),
    );
  }

  /**
   * Generates a file URL based on key
   */
  getFileUrl(key: string): string {
    return `https://${this.BUCKET_NAME}.s3.amazonaws.com/${key}`;
  }

  /**
   * Generates a presigned URL for accessing a file
   */
  async getPresignedSignedUrl(key: string): Promise<string> {
    const params = {
      Bucket: this.BUCKET_NAME,
      Key: key,
      Expires: 60 * 5, // Expires in 5 minutes
    };

    return this.s3.getSignedUrlPromise('getObject', params);
  }

  /**
   * Common operation handler for S3 requests
   */
  private async s3Operation<T>(
    operation: () => Promise<T>,
    errorMessage: string,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      console.error(`${errorMessage}:`, error);
      throw new HttpException(errorMessage, 500);
    }
  }

  /**
   * Create a tag in the database and upload associated file to S3
   */
  async createTag(
    createTagDto: CreateTagDto,
    file: Express.Multer.File,
    folder: string,
    isPublic: boolean,
  ): Promise<any> {
    const { tagName } = createTagDto;

    // Upload file to S3
    const uploadResult = await this.uploadFile(file, folder, isPublic);

    // Create tag in the database
    const tag = await this.tagModel.create({
      tagName,
      etag: uploadResult.ETag?.replace(/"/g, ''),
      key: uploadResult.Key,
    });

    return tag;
  }

  /**
   * Fetch all tags from the database
   */
  async getTags({ isPublic = false }): Promise<
    {
      tagId: string;
      tagName: string;
      url: string;
      etag?: string;
    }[]
  > {
    const tags = await this.tagModel.findAll();

    const tagsWithPresignedSignedUrls = await Promise.all(
      tags.map(async (tag) => ({
        tagId: tag._id,
        tagName: tag.tagName,
        url: await this.getPresignedSignedUrl(tag.key),
        etag: tag.etag,
      })),
    );
    const tagsWithUrls = tags.map((tag) => ({
      tagId: tag._id,
      tagName: tag.tagName,
      url: this.getFileUrl(tag.key),
      etag: tag.etag,
    }));

    return isPublic ? tagsWithUrls : tagsWithPresignedSignedUrls;
  }

  /**
   * Update a tag in the database
   */
  async updateTag(tagId: string, tagName: string, file: Express.Multer.File) {
    const tag = await this.tagModel.findById(tagId);
    if (!tag) {
      throw new HttpException(
        this.utilsService.getMessagesTypeSafe('assets.TAG_NOT_FOUND'),
        404,
      );
    }

    // Update the file in S3
    await this.deleteFile(tag.key);
    const uploadResult = await this.uploadFile(file, 'tags', true);

    // Update the tag in the database
    await this.tagModel.updateById(tagId, {
      tagName,
      etag: uploadResult.ETag?.replace(/"/g, ''),
      key: uploadResult.Key,
    });

    return {
      tagId,
      tagName,
      url: this.getFileUrl(uploadResult.Key),
    };
  }

  /**
   * Delete a tag from the database and S3
   */
  async deleteTag(tagId: string): Promise<boolean> {
    const session = await this.tagModel.startSession();
    session.startTransaction();

    try {
      const tag = await this.tagModel.findById(tagId);
      if (!tag) {
        throw new HttpException(
          this.utilsService.getMessagesTypeSafe('assets.TAG_NOT_FOUND'),
          404,
        );
      }

      // Concurrently delete the file from S3 and the tag from the database
      await Promise.all([
        this.deleteFile(tag.key),
        this.tagModel.deleteById(tagId),
      ]);

      await session.commitTransaction();
      return true;
    } catch (error) {
      await session.abortTransaction();
      console.error('Error deleting tag:', error);
      throw new HttpException(
        this.utilsService.getMessagesTypeSafe('assets.ERROR_DELETING_TAG'),
        500,
      );
    } finally {
      session.endSession();
    }
  }
}
