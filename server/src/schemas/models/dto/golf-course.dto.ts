import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

// Address DTO
export class AddressDto {
  @IsNotEmpty()
  @IsString()
  street1: string; // Changed from line1 to street1

  @IsString()
  @IsOptional()
  street2: string; // Changed from line2 to street2

  @IsNotEmpty()
  @IsString()
  city: string;

  @IsNotEmpty()
  @IsString()
  state: string; // Changed from province to state

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsNotEmpty()
  @IsString()
  postalCode: string; // Changed from zipcode to postalCode
}

// Location DTO
class LocationDto {
  @IsNotEmpty()
  @IsString()
  type: string; // Must be 'Point'

  @IsArray()
  @IsString({ each: true })
  coordinates: [string, string]; // [longitude, latitude]
}

// Pricing DTO
class PricingDto {
  @IsNotEmpty()
  @IsNumber()
  weekdayRate: number; // Changed from greenFee to weekdayRate

  @IsNotEmpty()
  @IsNumber()
  weekendRate: number; // Changed from greenFeeWeekend to weekendRate

  @IsNotEmpty()
  @IsNumber()
  cartFee: number; // Changed from cart to cartFee

  @IsNotEmpty()
  @IsNumber()
  caddieFee: number; // Changed from caddie to caddieFee
}

// Course DTO
class CourseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HoleDto)
  holes: HoleDto[];
}

// Hole DTO
class HoleDto {
  @IsNotEmpty()
  @IsString()
  hole: string;

  @IsNotEmpty()
  @IsNumber()
  par: number;
}

export class CreateGolfCourseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageGallery?: string[]; // Optional image gallery

  @IsArray()
  @IsNumber({}, { each: true })
  availableHoles: number[]; // List of available holes

  @IsOptional()
  @IsString()
  coverImage?: string;

  @ValidateNested()
  @Type(() => PricingDto)
  pricing: {
    daytime: PricingDto; // Changed from prices.day to daytime
    nighttime: PricingDto; // Changed from prices.night to nighttime
  };

  @IsNotEmpty()
  @IsBoolean()
  isNightAvailable: boolean;
}
