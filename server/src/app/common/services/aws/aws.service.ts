import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { S3 } from 'aws-sdk';
import { AllConfigType } from 'src/app/config/config.type';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class AwsService {
  private s3: S3;
  private s3Client: S3Client;

  constructor(private readonly configService: ConfigService<AllConfigType>) {
    this.s3 = new AWS.S3({
      accessKeyId: this.getConfig('assets.accessKeyId'),
      secretAccessKey: this.getConfig('assets.secretAccessKey'),
      region: this.getConfig('assets.awsS3Region'),
    });
    this.s3Client = new S3Client({
      region: this.getConfig('assets.awsS3Region'), // Replace with your AWS region
      credentials: {
        accessKeyId: this.getConfig('assets.accessKeyId'), // Replace with your access key
        secretAccessKey: this.getConfig('assets.secretAccessKey'), // Replace with your secret key
      },
    });
  }

  getBucketName(): string {
    return this.getConfig('assets.awsDefaultS3Bucket');
  }

  getUrl(bucketName: string, key: string): string {
    return `https://${bucketName}.s3.amazonaws.com/${key}`;
  }

  async generatePresignedUrl(
    bucketName: string,
    objectKey: string,
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });
    const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 }); // URL valid for 1 hour
    // console.log("Presigned URL:", url);
    return url;
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

  async getSignedUrl(
    bucketName: string,
    key: string,
    args: any,
  ): Promise<string> {
    const params = {
      Bucket: bucketName,
      Key: key,
      ...args,
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
