import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ScoresService } from './scores.service';
import { JwtAuthGuard } from '../auth/guard';
import { JwtPayloadType } from '../auth/strategies/types';
import { CreateScoresDto } from 'src/schemas/models/dto';

@Controller('scores')
@UseGuards(JwtAuthGuard) // Apply the JwtAuthGuard globally to the controller
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  // Fetch hole scores by match ID
  @Get(':matchId')
  async getHoleScores(
    @Param('matchId') matchId: string,
    @Req() req: Request & { decoded: JwtPayloadType },
  ) {
    const { decoded } = req;
    return this.scoresService.getHoleScores(matchId, decoded);
  }

  // Fetch scorecard for the authenticated player
  @Get('player/scorecard')
  async getScorecard(@Req() req: Request & { decoded: JwtPayloadType }) {
    const userId = req.decoded.userId;
    return this.scoresService.getScoreCardByPlayerId(userId);
  }

  @Get('player/scorecard/:matchId')
  async getScorecardByMatch(
    @Param('matchId') matchId: string,
    @Req() req: Request & { decoded: JwtPayloadType },
  ) {
    const userId = req.decoded.userId;
    return this.scoresService.getScoreCardByPlayerIdAndMatch(userId, matchId);
  }

  // Create new hole scores
  @Post()
  async createHoleScores(
    @Body() createHoleScoresDto: CreateScoresDto,
    @Req() req: Request & { decoded: JwtPayloadType },
  ) {
    const { decoded } = req;
    return this.scoresService.createHoleScores(createHoleScoresDto, decoded);
  }
}
