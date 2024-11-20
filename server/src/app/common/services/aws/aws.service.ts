import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { S3 } from 'aws-sdk';
import { AllConfigType } from 'src/app/config/config.type';

@Injectable()
export class AwsService {
  private s3: S3;

  constructor(private readonly configService: ConfigService<AllConfigType>) {
    this.s3 = new AWS.S3({
      accessKeyId: this.getConfig('assets.accessKeyId'),
      secretAccessKey: this.getConfig('assets.secretAccessKey'),
      region: this.getConfig('assets.awsS3Region'),
    });
  }

  private getConfig(key: string): string {
    const value = this.configService.get<string>(key, { infer: true });
    if (!value) throw new Error(`Missing config key: ${key}`);
    return value;
  }

  async uploadFile(
    bucketName: string,
    key: string,
    fileContent: Buffer,
    contentType: string,
    ...args: any[]
  ): Promise<S3.ManagedUpload.SendData> {
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: fileContent,
      ContentType: contentType,
      ...args,
    };

    return this.s3.upload(params).promise();
  }

  async getFile(bucketName: string, key: string): Promise<S3.GetObjectOutput> {
    const params = {
      Bucket: bucketName,
      Key: key,
    };

    return this.s3.getObject(params).promise();
  }

  async deleteFile(bucketName: string, key: string): Promise<void> {
    const params = {
      Bucket: bucketName,
      Key: key,
    };

    await this.s3.deleteObject(params).promise();
  }

  async getSignedUrl(bucketName: string, key: string): Promise<string> {
    const params = {
      Bucket: bucketName,
      Key: key,
    };

    return this.s3.getSignedUrlPromise('getObject', params);
  }

  async getSignedUrlForUpload(
    bucketName: string,
    key: string,
  ): Promise<string> {
    const params = {
      Bucket: bucketName,
      Key: key,
      ContentType: 'image/jpeg',
    };

    return this.s3.getSignedUrlPromise('putObject', params);
  }
}
