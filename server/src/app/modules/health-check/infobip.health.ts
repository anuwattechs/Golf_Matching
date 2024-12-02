import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/app/config/config.type';

@Injectable()
export class InfobipHealthIndicator extends HealthIndicator {
  private infobipApiKey: string;
  private infobipBaseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    configService: ConfigService<AllConfigType>,
  ) {
    super();
    this.infobipBaseUrl = configService.get<string>('sms.baseUrl', {
      infer: true,
    });
    this.infobipApiKey = configService.get<string>('sms.authToken', {
      infer: true,
    });
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    try {
      const response = await lastValueFrom(
        this.httpService.get(this.infobipBaseUrl, {
          headers: {
            Authorization: `App ${this.infobipApiKey}`,
          },
        }),
      );
      if (response.status === 200) {
        return this.getStatus('infobip', true);
      }
      throw new Error('Infobip is down');
    } catch (error) {
      throw new HealthCheckError('InfobipHealthIndicator failed', error);
    }
  }
}
