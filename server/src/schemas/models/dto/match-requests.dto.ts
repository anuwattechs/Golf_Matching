import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMatchRequestDto {
  @IsString()
  @IsNotEmpty()
  matchId: string;

  @IsString()
  @IsOptional()
  playerId: string;

  @IsEnum(['REQUESTED', 'DECLINED'])
  @IsOptional()
  status?: string = 'REQUESTED';

  @IsDate()
  @IsOptional()
  requestedAt: Date;

  @IsEnum(['LET_HOST', 'BOOK_THIS_CADDIE', 'PICK_AT_COURSE'])
  @IsNotEmpty()
  caddieSelection: string;

  @IsString()
  @IsOptional()
  caddieId?: string;

  @IsString()
  @IsOptional()
  caddieInfo?: string;
}

export class UpdateMatchRequestDto {
  matchRequestId: string;

  @IsString()
  @IsOptional()
  matchId?: string;

  @IsString()
  @IsOptional()
  playerId?: string;

  @IsEnum(['REQUESTED', 'DECLINED'])
  @IsOptional()
  status?: string;

  @IsDate()
  @IsOptional()
  requestedAt?: Date;

  @IsEnum(['LET_HOST', 'BOOK_THIS_CADDIE', 'PICK_AT_COURSE'])
  @IsOptional()
  caddieSelection?: string;

  @IsString()
  @IsOptional()
  caddieId?: string;

  @IsString()
  @IsOptional()
  caddieInfo?: string;
}
