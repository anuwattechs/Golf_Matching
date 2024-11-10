import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { HoleScoresService } from './hole-scores.service';
import { CreateHoleScoresDto } from 'src/schemas/models/dto';
import { JwtAuthGuard } from '../auth/guard';
import { JwtPayloadType } from '../auth/strategies/types';

@Controller('hole-scores')
export class HoleScoresController {
  constructor(private readonly holeScoresService: HoleScoresService) {}

  @Get(':matchId')
  @UseGuards(JwtAuthGuard)
  async getHoleScores(
    @Param('matchId') matchId: string,
    @Req() req: Request & { decoded: JwtPayloadType },
  ) {
    return await this.holeScoresService.getHoleScores(matchId, req.decoded);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createHoleScores(
    @Body() createHoleScoresDto: CreateHoleScoresDto,
    @Req() req: Request & { decoded: JwtPayloadType },
  ) {
    return await this.holeScoresService.createHoleScores(
      createHoleScoresDto,
      req.decoded,
    );
  }
}
