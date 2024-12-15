import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { S3 } from 'aws-sdk';
import { AllConfigType } from 'src/app/config/config.type';
import { UtilsService } from 'src/shared/utils/utils.service';

@Injectable()
export class S3HealthIndicator extends HealthIndicator {
  private readonly s3: S3;

  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly utilsService: UtilsService,
  ) {
    super();
    this.s3 = new S3({
      accessKeyId: this.getConfig('assets.accessKeyId'),
      secretAccessKey: this.getConfig('assets.secretAccessKey'),
    });
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

  async isHealthy(): Promise<HealthIndicatorResult> {
    try {
      // Check if S3 is available by listing buckets
      await this.s3.listBuckets().promise();
      return this.getStatus('s3', true);
    } catch (error) {
      throw new HealthCheckError('S3HealthIndicator failed', error);
    }
  }
}
