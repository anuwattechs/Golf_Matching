import { Controller, Get, Param } from '@nestjs/common';
import { CountryService } from './country.service';
import { ResponseMessage } from 'src/app/common/decorator/response-message.decorator';
import { UtilsService } from 'src/shared/utils/utils.service';

@Controller('country')
export class CountryController {
  constructor(
    private readonly countryService: CountryService,
    private readonly utilsService: UtilsService,
  ) {}

  @Get()
  @ResponseMessage('country.COUNTRIES_FETCHED_SUCCESSFULLY')
  async getCountries() {
    try {
      return await this.countryService.getCountries();
    } catch (error) {
      throw new Error(
        this.utilsService.getMessagesTypeSafe(
          'country.FAILED_TO_FETCH_COUNTRIES',
        ),
      );
    }
  }

  @Get('states')
  @ResponseMessage('country.STATES_FETCHED_SUCCESSFULLY')
  async getStates() {
    try {
      return await this.countryService.getStates();
    } catch (error) {
      throw new Error(
        this.utilsService.getMessagesTypeSafe('country.FAILED_TO_FETCH_STATES'),
      );
    }
  }

  @Get('countries/:countryId')
  @ResponseMessage('country.COUNTRIES_FETCHED_SUCCESSFULLY')
  async getStatesByCountry(@Param('countryId') countryId: string) {
    try {
      return await this.countryService.getStatesByCountry(countryId);
    } catch (error) {
      throw new Error(
        this.utilsService.getMessagesTypeSafe('country.FAILED_TO_FETCH_STATES'),
      );
    }
  }
}
