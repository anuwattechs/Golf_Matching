export type TServiceResponse = {
  status: 'success' | 'error';
  statusCode: number;
  message: string;
  data: any[];
};

export type TResponse<T> = {
  status: 'success' | 'error';
  statusCode: number;
  message: string;
  data: T;
};
