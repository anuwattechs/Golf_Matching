import { Controller, Get, Req, UseGuards, Query } from "@nestjs/common";
import { MatchService } from "./match.service";
import { ResultPaginationMatchesHistoryDto } from "../../../schemas/models/dto/match.dto";
import { JwtAuthGuard } from "../auth/guard";
import { JwtPayloadType } from "../auth/strategies/types";

@Controller("match")
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  /**
   * Get the match history of the logged-in user
   * @param req The request object containing the decoded JWT payload
   * @returns List of matches history
   */
  @Get("history/me")
  @UseGuards(JwtAuthGuard)
  async getMatchHistory(
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10,
    @Req() req: Request & { decoded: JwtPayloadType }
  ): Promise<ResultPaginationMatchesHistoryDto> {
    if (page < 1) {
      page = 1;
    }
    if (limit < 1) {
      limit = 10;
    }
    return await this.matchService.getMatchHistory(req.decoded, page, limit);
  }
}
