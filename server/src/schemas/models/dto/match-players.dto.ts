import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsOptional,
} from 'class-validator';

export class CreateMatchPlayerDto {
  @IsString()
  @IsNotEmpty()
  matchId: string;

  @IsString()
  @IsOptional()
  playerId: string;

  @IsBoolean()
  @IsOptional()
  isHost: boolean;

  @IsDate()
  @IsOptional()
  joinedAt: Date;

  @IsEnum(['LET_HOST', 'BOOK_THIS_CADDIE', 'PICK_AT_COURSE'])
  @IsOptional()
  caddieSelection: string;

  @IsString()
  @IsOptional()
  caddieId?: string;

  @IsString()
  @IsOptional()
  caddieInfo?: string;
}

export class UpdateMatchPlayerDto {
  matchPlayerId: string;

  @IsString()
  @IsOptional()
  matchId?: string;

  @IsString()
  @IsOptional()
  playerId?: string;

  @IsString()
  @IsOptional()
  scoreCardId?: string;

  @IsBoolean()
  @IsOptional()
  isHost?: boolean;

  @IsDate()
  @IsOptional()
  joinedAt?: Date;

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
