import { Controller, Get, Param } from '@nestjs/common';
import { CountryService } from './country.service';
import { ResponseMessage } from 'src/app/common/decorator/response-message.decorator';

@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get()
  @ResponseMessage('Countries fetched successfully')
  async getCountries() {
    try {
      return await this.countryService.getCountries();
    } catch (error) {
      throw new Error('Failed to fetch countries');
    }
  }

  @Get('states')
  @ResponseMessage('States fetched successfully')
  async getStates() {
    try {
      return await this.countryService.getStates();
    } catch (error) {
      throw new Error('Failed to fetch states');
    }
  }

  @Get('countries/:countryId')
  @ResponseMessage('States fetched successfully')
  async getStatesByCountry(@Param('countryId') countryId) {
    try {
      return await this.countryService.getStatesByCountry(countryId);
    } catch (error) {
      throw new Error('Failed to fetch states');
    }
  }
}
