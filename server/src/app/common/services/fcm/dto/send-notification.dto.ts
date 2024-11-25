import { IsString, IsOptional, IsObject } from 'class-validator';

export class SendNotificationDto {
  @IsString()
  readonly token: string;

  @IsString()
  readonly title: string;

  @IsString()
  readonly body: string;

  @IsObject()
  @IsOptional()
  readonly data?: Record<string, string>;
}
