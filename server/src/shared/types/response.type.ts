export type ResponseType<T> = {
  status: boolean;
  statusCode: number;
  message: string;
  data: T;
};
