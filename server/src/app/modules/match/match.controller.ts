import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MatchService } from './match.service';
import {
  CreateMatchDto,
  MatchesHistoryDto,
} from '../../../schemas/models/dto/match.dto';
import { JwtAuthGuard } from '../auth/guard';
import { JwtPayloadType } from '../auth/strategies/types';

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  /**
   * Get all matches
   * @returns List of all matches
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllMatches() {
    return await this.matchService.getAllMatches();
  }

  /**
   * Get a match by its ID
   * @param matchId The ID of the match
   * @returns The match details
   */
  @Get(':matchId/details')
  @UseGuards(JwtAuthGuard)
  async getMatchById(@Param('matchId') matchId: string) {
    return await this.matchService.getMatchById(matchId);
  }

  /**
   * Get the match history of the logged-in user
   * @param req The request object containing the decoded JWT payload
   * @returns List of the user's match history
   */
  @Get('history/me')
  @UseGuards(JwtAuthGuard)
  async getMatchHistory(
    @Req() req: Request & { decoded: JwtPayloadType },
  ): Promise<MatchesHistoryDto[]> {
    return await this.matchService.getMatchHistory(req.decoded);
  }

  /**
   * Create a new match
   * @param body The data required to create a new match
   * @param req The request object containing the decoded JWT payload
   * @returns The newly created match
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  async createMatch(
    @Body() body: CreateMatchDto,
    @Req() req: Request & { decoded: JwtPayloadType },
  ) {
    return await this.matchService.createMatch(body, req.decoded);
  }
}
