import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [ConfigModule, CountryController],
  providers: [CountryService],
})
export class CountryModule {}
