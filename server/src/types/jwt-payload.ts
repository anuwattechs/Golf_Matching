export type TJwtPayload = {
  user_id: string;
  name?: string;
  email: string;
  role: string | string[];
  plant_code: string;
  iat?: number;
  exp?: number;
};

export type TRequestWithDecoded = Request & { decoded: TJwtPayload };
