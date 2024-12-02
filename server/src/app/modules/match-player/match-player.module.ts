import { Module } from '@nestjs/common';
import { MatchPlayerService } from './match-player.service';
import { MatchPlayerController } from './match-player.controller';

@Module({
  controllers: [MatchPlayerController],
  providers: [MatchPlayerService],
})
export class MatchPlayerModule {}
