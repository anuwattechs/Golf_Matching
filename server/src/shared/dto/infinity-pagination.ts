import { IPaginationOptions } from '../types';
import { InfinityPaginationResponseDto } from '.';

export const infinityPagination = <T>(
  result: T[],
  options: IPaginationOptions,
): InfinityPaginationResponseDto<T> => {
  return {
    result,
    pagination: {
      page: options.page,
      limit: options.limit,
      hasNextPage: result.length === options.limit,
      hasPrevPage: options.page > 1,
    },
  };
};
