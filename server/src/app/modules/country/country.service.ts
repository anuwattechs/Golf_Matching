import { HttpException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { AllConfigType } from 'src/app/config/config.type';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CountryService {
  private baseUrl: string;
  private authToken: string;
  private headers: {
    'X-CSCAPI-KEY': string;
  };

  constructor(configService: ConfigService<AllConfigType>) {
    this.baseUrl = configService.get<string>('country.baseUrl', {
      infer: true,
    });
    this.authToken = configService.get<string>('country.authToken', {
      infer: true,
    });
    this.headers = {
      'X-CSCAPI-KEY': this.authToken,
    };
  }

  async getCountries() {
    const url = `${this.baseUrl}/countries`;
    const headers = this.headers;
    try {
      const response = await axios.get(url, { headers });
      return response?.data;
    } catch (error) {
      throw new HttpException('Failed to get countries', 500);
    }
  }
}
