import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { ScoresService } from "./scores.service";
import { JwtAuthGuard } from "../auth/guard";
import { JwtPayloadType } from "../auth/strategies/types";
import { ResultsPaginatedScoreCardsDto } from "src/schemas/models/dto";

@Controller("scores")
@UseGuards(JwtAuthGuard)
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Get("player/scorecard")
  async getScorecard(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Req() req: Request & { decoded: JwtPayloadType }
  ): Promise<ResultsPaginatedScoreCardsDto> {
    if (page < 1) {
      page = 1;
    }

    if (limit < 1) {
      limit = 10;
    }
    const userId = req.decoded.userId;
    return this.scoresService.getScoreCardByPlayerIdWithPagination(
      userId,
      page,
      limit
    );
  }
}
