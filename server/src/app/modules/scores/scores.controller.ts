import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ScoresService } from './scores.service';
import { JwtAuthGuard } from '../auth/guard';
import { JwtPayloadType } from '../auth/strategies/types';
import {
  CreateScoresDto,
  ResultsPaginatedScoreCardsDto,
} from 'src/schemas/models/dto';

@Controller('scores')
@UseGuards(JwtAuthGuard)
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Get(':matchId')
  async getHoleScores(
    @Param('matchId') matchId: string,
    @Req() req: Request & { decoded: JwtPayloadType },
  ) {
    const { decoded } = req;
    return this.scoresService.getHoleScores(matchId, decoded);
  }

  @Get('player/scorecard')
  async getScorecard(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() req: Request & { decoded: JwtPayloadType },
  ): Promise<ResultsPaginatedScoreCardsDto> {
    const userId = req.decoded.userId;
    return this.scoresService.getScoreCardByPlayerIdWithPagination(
      userId,
      page,
      limit,
    );
  }

  @Get('player/scorecard/:matchId')
  async getScorecardByMatch(
    @Param('matchId') matchId: string,
    @Req() req: Request & { decoded: JwtPayloadType },
  ) {
    const userId = req.decoded.userId;
    return this.scoresService.getScoreCardByPlayerIdAndMatch(userId, matchId);
  }

  @Post()
  async createHoleScores(
    @Body() createHoleScoresDto: CreateScoresDto,
    @Req() req: Request & { decoded: JwtPayloadType },
  ) {
    const { decoded } = req;
    return this.scoresService.createHoleScores(createHoleScoresDto, decoded);
  }
}
