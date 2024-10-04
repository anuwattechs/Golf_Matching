import { Controller } from '@nestjs/common';
import { CountryService } from './country.service';
import { Get } from '@nestjs/common';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  async getCountries() {
    return this.countryService.getCountries();
  }
}
