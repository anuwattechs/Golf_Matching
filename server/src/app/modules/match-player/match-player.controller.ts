import { Controller } from '@nestjs/common';
import { MatchPlayerService } from './match-player.service';

@Controller('match-player')
export class MatchPlayerController {
  constructor(private readonly matchPlayerService: MatchPlayerService) {}
}
