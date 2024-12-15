import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MatchRequestsService } from './match-requests.service';
import { CreateMatchRequestDto } from 'src/schemas/models/dto';
import { JwtAuthGuard } from '../auth/guard';
import { JwtPayloadType } from '../auth/strategies/types';

@Controller('match-requests')
export class MatchRequestsController {
  constructor(private readonly matchRequestsService: MatchRequestsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllMatchRequests() {
    return await this.matchRequestsService.getAllMatchRequests();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createMatchRequest(
    @Body() body: CreateMatchRequestDto,
    @Req() req: Request & { decoded: JwtPayloadType },
  ) {
    return await this.matchRequestsService.createMatchRequest(
      body,
      req.decoded,
    );
  }

  @Put(':requestId')
  @UseGuards(JwtAuthGuard)
  async responseMatchRequest(
    @Param('requestId') requestId: string,
    @Body() body: { status: 'ACCEPTED' | 'DECLINED' },
    @Req() req: Request & { decoded: JwtPayloadType },
  ) {
    return await this.matchRequestsService.respondToMatchRequest(
      { requestId, status: body.status },
      req.decoded,
    );
  }
}
