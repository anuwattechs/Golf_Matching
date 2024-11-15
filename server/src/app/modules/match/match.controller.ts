import { Body, Controller, Req, UseGuards } from '@nestjs/common';
import { MatchService } from './match.service';
import { Get, Post } from '@nestjs/common';
import { CreateMatchDto } from '../../../schemas/models/dto/match.dto';
import { JwtAuthGuard } from '../auth/guard';
import { JwtPayloadType } from '../auth/strategies/types';

@Controller('match')
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllMatches() {
    return await this.matchService.getAllMatches();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createMatch(
    @Body() body: CreateMatchDto,
    @Req() req: Request & { decoded: JwtPayloadType },
  ) {
    return await this.matchService.createMatch(body, req.decoded);
  }
}
