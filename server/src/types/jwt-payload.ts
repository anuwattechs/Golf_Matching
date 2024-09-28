export type TJwtPayload = {
  user_id: string;
  name?: string;
  email: string;
  phone_number?: string;
  iat?: number;
  exp?: number;
};

export type TRequestWithDecoded = Request & { decoded: TJwtPayload };
