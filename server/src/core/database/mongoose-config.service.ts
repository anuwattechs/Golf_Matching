import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { AllConfigType } from 'src/app/config/config.type';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private configService: ConfigService<AllConfigType>) {}

  createMongooseOptions(): MongooseModuleOptions {
    const url = this.configService.get<string>('database.url', { infer: true });
    const dbName = this.configService.get<string>('database.name', {
      infer: true,
    });
    const user = this.configService.get<string>('database.username', {
      infer: true,
    });
    const pass = this.configService.get<string>('database.password', {
      infer: true,
    });

    console.log('Connecting to MongoDB with the following options:');
    console.log(`URI: ${url}, Database Name: ${dbName}`);

    return {
      uri: url,
      dbName,
      user,
      pass,
    };
  }
}
