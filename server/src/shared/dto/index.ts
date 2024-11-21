import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * Represents pagination metadata.
 */
export class PaginationDto {
  /** Total number of items. */
  @IsInt()
  @IsPositive()
  total: number;

  /** Current page number. */
  @IsInt()
  @IsPositive()
  page: number;

  /** Number of items per page. */
  @IsInt()
  @IsPositive()
  limit: number;

  /** Total number of pages. */
  @IsInt()
  @IsPositive()
  totalPages: number;

  /** Indicates if there is a next page. */
  @IsBoolean()
  hasNextPage: boolean;

  /** Indicates if there is a previous page. */
  @IsBoolean()
  hasPrevPage: boolean;
}

/**
 * Represents a paginated result set.
 * @template T The type of items in the result array.
 * @category DTO
 * @abstract
 * @class ResultPaginationDto The paginated result set.
 */
export abstract class ResultPaginationDto<T> {
  @IsArray()
  @ValidateNested({ each: true })
  result: T[];

  @IsObject()
  @ValidateNested()
  @Type(() => PaginationDto)
  pagination: PaginationDto;
}
