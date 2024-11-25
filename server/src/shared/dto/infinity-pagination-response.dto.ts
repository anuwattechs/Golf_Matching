import { Type } from '@nestjs/common';

export class InfinityPaginationResponseDto<T> {
  result: T[];
  pagination: {
    page: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export function InfinityPaginationResponse<T>(classReference: Type<T>) {
  abstract class Pagination {
    result: T[];
    pagination: {
      page: number;
      limit: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  }

  Object.defineProperty(Pagination, 'name', {
    writable: false,
    value: `InfinityPagination${classReference.name}ResponseDto`,
  });

  return Pagination;
}
