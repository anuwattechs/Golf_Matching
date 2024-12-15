import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { omit } from "lodash";
import {
  MemberModel,
  GolfCourseLayoutModel,
  MatchPlayerModel,
  ScoresModel,
  MatchesModel,
  GolfCourseModel,
} from "src/schemas/models";
import { NullableType } from "src/shared/types";
import { JwtPayloadType } from "../auth/strategies/types";
import {
  CreateScoresDto,
  ResScoreCardDto,
  ResultsPaginatedScoreCardsDto,
  ScoreCardDto,
  Stats,
} from "src/schemas/models/dto";
import { Scores } from "src/schemas";
import { UtilsService } from "src/shared/utils/utils.service";

@Injectable()
export class ScoresService {
  constructor(
    private readonly memberModel: MemberModel,
    private readonly golfCourseLayoutModel: GolfCourseLayoutModel,
    private readonly matchPlayerModel: MatchPlayerModel,
    private readonly scoresModel: ScoresModel,
    private readonly matchesModel: MatchesModel,
    private readonly golfCourseModel: GolfCourseModel,
    private readonly utilsService: UtilsService
  ) {}

  async getScoreCardByPlayerIdAndMatch(
    playerId: string,
    matchId: string
  ): Promise<NullableType<unknown>> {
    try {
      const score = await this.getHoleScores(matchId, { userId: playerId });
      const scoreDetail = (score as any[])?.find(
        (s) => s.playerId.toString() === playerId
      );
      return scoreDetail;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getHoleScores(
    matchId: string,
    decoded: JwtPayloadType
  ): Promise<NullableType<unknown>> {
    try {
      await this.validateUserAndMatch(matchId, decoded.userId);

      const [players, holeScores] = await Promise.all([
        this.matchPlayerModel.getPlayersForMatch(matchId),
        this.scoresModel.getHoleScoresForMatch(matchId),
      ]);

      const layoutCache = new Map<string, any>();
      const results = await Promise.all(
        players.map(async (player) => {
          const filteredPlayer = omit(player.toObject(), [
            "_id",
            "createdAt",
            "updatedAt",
          ]);

          const playerScores = holeScores.filter(
            (score) => score.playerId.toString() === player.playerId.toString()
          );

          const filteredScores = playerScores.map((score) =>
            omit(score, ["_id", "createdAt", "updatedAt", "playerId"])
          );

          let totalScore = 0;
          for (const score of filteredScores) {
            const hole = await this.getHoleFromCache(
              score.hole,
              score.golfCourseLayoutId,
              layoutCache
            );
            totalScore += this.calculateScore({
              strokes: score.strokes,
              chipIns: score.chipIns,
              putts: score.putts,
              par: hole.par,
            });
          }

          return {
            ...filteredPlayer,
            totalScore,
            holeScores: filteredScores,
          };
        })
      );

      return results;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createHoleScores(
    input: CreateScoresDto,
    decoded: JwtPayloadType
  ): Promise<NullableType<unknown>> {
    try {
      await this.validateUserAndMatch(input.matchId, decoded.userId);
      await this.golfCourseLayoutModel.validateGolfCourseLayout(
        input.golfCourseLayoutId,
        input.hole
      );
      const existingScore = await this.scoresModel.getHoleScoreByMatchAndHole(
        input.matchId,
        input.hole,
        input.playerId
      );
      if (existingScore) {
        throw new HttpException(
          "Hole score already exists",
          HttpStatus.BAD_REQUEST
        );
      }

      return this.scoresModel.addHoleScore(input);
    } catch (error) {
      this.handleError(error);
    }
  }

  private async validateUserAndMatch(
    matchId: string,
    userId: string
  ): Promise<void> {
    const isUserRegistered =
      await this.memberModel.checkUserRegistration(userId);
    if (!isUserRegistered) {
      throw new HttpException("User not registered", HttpStatus.BAD_REQUEST);
    }

    const isPlayerInMatch =
      await this.matchPlayerModel.checkPlayerInMatchExists(matchId, userId);
    if (!isPlayerInMatch) {
      throw new HttpException(
        "Player in match not found",
        HttpStatus.BAD_REQUEST
      );
    }
  }

  private handleError(error: any): void {
    const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
    throw new HttpException(
      {
        status: false,
        statusCode: status,
        message: error.message || "Internal server error",
        data: null,
      },
      status
    );
  }

  private async getHoleFromCache(
    holeNumber: number,
    golfLayoutId: string,
    cache: Map<string, any>
  ): Promise<any> {
    const cacheKey = `${golfLayoutId}-${holeNumber}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const golfLayout =
      await this.golfCourseLayoutModel.getGolfCourseLayoutById(golfLayoutId);
    const hole = golfLayout?.holes.find(
      (h) => h.hole === holeNumber.toString()
    );

    if (hole) {
      cache.set(cacheKey, hole);
    }

    return hole;
  }

  private calculateScore(holeData: {
    strokes: number;
    chipIns: number;
    putts: number;
    par: number;
  }): number {
    const { strokes, putts, chipIns, par } = holeData;

    const score = strokes - par;
    const adjustedScore = score - putts + chipIns;

    return adjustedScore;
  }

  private async calculateTotalScore(
    scores: Scores[],
    layoutCache: Map<string, any>
  ): Promise<{
    myScore: number;
    overScore: number;
    fairways: number;
    puttsRound: number;
    puttsHole: number;
  }> {
    let totalScore = 0;
    let totalOverScore = 0;
    let totalPuttsRound = 0;

    for (const score of scores) {
      const layout = await this.getGolfCourseLayoutFromCache(
        score.golfCourseLayoutId,
        layoutCache
      );
      const hole = layout.holes.find(
        (h: { hole: string }) => h.hole === score.hole.toString()
      );
      if (!hole) continue;

      const scoreValue = this.calculateScore({
        strokes: score.strokes,
        chipIns: score.chipIns,
        putts: score.putts,
        par: hole.par,
      });

      totalScore += scoreValue;
      totalOverScore += scoreValue - hole.par;
      totalPuttsRound += score.putts;
    }

    const totalHoles = scores.length;
    const puttsHole = totalHoles > 0 ? totalPuttsRound / totalHoles : 0;

    const totalFairways = await this.calculateFairwayHitPercentage(
      scores,
      layoutCache
    );

    return {
      myScore: totalScore,
      overScore: totalOverScore,
      fairways: totalFairways,
      puttsRound: totalPuttsRound,
      puttsHole: puttsHole,
    };
  }

  private async getGolfCourseLayoutFromCache(
    golfCourseLayoutId: string,
    cache: Map<string, any>
  ): Promise<any> {
    if (cache.has(golfCourseLayoutId)) {
      return cache.get(golfCourseLayoutId);
    }

    const layout =
      await this.golfCourseLayoutModel.getGolfCourseLayoutById(
        golfCourseLayoutId
      );
    cache.set(golfCourseLayoutId, layout);

    return layout;
  }

  private async calculateFairwayHitPercentage(
    scores: Scores[],
    layoutCache: Map<string, any>
  ): Promise<number> {
    let totalFairways = 0;
    let totalPar4AndPar5Holes = 0;

    // Loop through each score
    for (const score of scores) {
      // Fetch golf course layout from cache
      const layout = await this.getGolfCourseLayoutFromCache(
        score.golfCourseLayoutId,
        layoutCache
      );
      // Find the hole in the layout
      const hole = layout.holes.find(
        (h: { hole: string }) => h.hole === score.hole.toString()
      );

      // If hole not found, skip
      if (!hole) continue;

      // Count only Par 4 and Par 5 holes
      if (hole.par === 4 || hole.par === 5) {
        totalPar4AndPar5Holes += 1;
        // Check if player hit the fairway (strokes = 1 and chipIns = 0)
        if (score.strokes === 1 && score.chipIns === 0) {
          totalFairways += 1;
        }
      }

      // console.table([
      //   {
      //     match: score.matchId,
      //     hole: score.hole,
      //     strokes: score.strokes,
      //     chipIns: score.chipIns,
      //     putts: score.putts,
      //     par: hole.par,
      //     isFairway: score.strokes === 1 && score.chipIns === 0,
      //     totalFairways,
      //     fairwaysPercentage:
      //       totalPar4AndPar5Holes > 0
      //         ? Math.max(0, (totalFairways / totalPar4AndPar5Holes) * 100)
      //         : 0,
      //   },
      // ]);
    }

    // Calculate Fairway Hit percentage
    const fairwayHitPercentage =
      totalPar4AndPar5Holes > 0
        ? Math.max(0, (totalFairways / totalPar4AndPar5Holes) * 100)
        : 0;

    return fairwayHitPercentage;
  }

  async getScoreCardByPlayerIdWithPagination(
    playerId: string,
    page: number,
    limit: number
  ): Promise<ResultsPaginatedScoreCardsDto> {
    try {
      const allMatchByPlayer =
        await this.matchPlayerModel.getMatchPlayerById(playerId);
      const matchIds = allMatchByPlayer.map((player) => player.matchId);

      const playerMatchesWithPagination =
        await this.utilsService.findAllWithPaginationAndFilter(
          this.matchesModel.rootMatchModel(),
          page,
          limit,
          { _id: { $in: matchIds } }
        );

      const {
        data: paginatedMatches,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
      } = playerMatchesWithPagination;

      const layoutCache = new Map<string, any>();
      const courseCache = new Map<string, any>();

      const scoreCards: ResScoreCardDto[] = await Promise.all(
        paginatedMatches.map(async (match) => {
          const { courseId, _id: matchId, datetime, maxPlayers } = match;

          const scores =
            await this.scoresModel.findHoleScoreByMatchIdAndPlayerId(
              matchId,
              playerId
            );

          const { myScore, overScore, fairways, puttsRound, puttsHole } =
            await this.calculateTotalScore(scores, layoutCache);

          let course = courseCache.get(courseId);
          if (!course) {
            course = await this.golfCourseModel.findById(courseId);
            courseCache.set(courseId, course);
          }

          const courseName = course?.name || "";
          const address = {
            street1: course?.address?.street1 || "",
            street2: course?.address?.street2 || "",
            city: course?.address?.city || "",
            state: course?.address?.state || "",
            country: course?.address?.country || "",
            postalCode: course?.address?.postalCode || "",
          };

          return {
            matchId,
            playerId,
            datetime,
            courseId,
            courseName,
            address,
            maxPlayers,
            myScore: this.utilsService.parseNumberToString(276),
            overScore: this.utilsService.parseNumberToString(9),
            fairways: `${this.utilsService.parseNumberToString(57.14)}%`,
            puttsRound: this.utilsService.parseNumberToString(28),
            puttsHole: this.utilsService.parseNumberToString(1.56),
          };
        })
      );

      return {
        result: scoreCards,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage,
          hasPrevPage,
        },
      };
    } catch (error) {
      console.error("Error in getScoreCardByPlayerId:", error.message);
      throw new HttpException(
        "Failed to get score card",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getScoreCardByPlayerIdWithOldPagination(
    playerId: string
  ): Promise<ScoreCardDto[]> {
    try {
      const allMatchByPlayer =
        await this.matchPlayerModel.getMatchPlayerById(playerId);
      const matchIds = allMatchByPlayer.map((player) => player.matchId);

      const playerMatches = (await this.matchesModel.findAll()).filter(
        (match) => matchIds.includes(match._id.toString())
      );

      const layoutCache = new Map<string, any>();
      const courseCache = new Map<string, any>();

      const scoreCards: ScoreCardDto[] = await Promise.all(
        playerMatches.map(async (match) => {
          const { courseId, _id: matchId, datetime, maxPlayers } = match;

          const scores =
            await this.scoresModel.findHoleScoreByMatchIdAndPlayerId(
              matchId,
              playerId
            );

          const { myScore, overScore, fairways, puttsRound, puttsHole } =
            await this.calculateTotalScore(scores, layoutCache);

          let course = courseCache.get(courseId);
          if (!course) {
            course = await this.golfCourseModel.findById(courseId);
            courseCache.set(courseId, course);
          }

          const courseName = course?.name || "";
          const address = {
            street1: course?.address?.street1 || "",
            street2: course?.address?.street2 || "",
            city: course?.address?.city || "",
            state: course?.address?.state || "",
            country: course?.address?.country || "",
            postalCode: course?.address?.postalCode || "",
          };

          return {
            matchId,
            playerId,
            datetime,
            courseId,
            courseName,
            address,
            maxPlayers,
            myScore,
            overScore,
            fairways,
            puttsRound,
            puttsHole,
          };
        })
      );

      return scoreCards;
    } catch (error) {
      console.error("Error in getScoreCardByPlayerId:", error.message);
      throw new HttpException(
        "Failed to get score card",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getStats(userId: string): Promise<Stats> {
    const member = await this.memberModel.findById(userId);
    return {
      yearStart: member?.yearStart || "",
      handicap: 25,
      avgScore: 0,
    };
  }
}
