import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { omit } from 'lodash';
import {
  MemberModel,
  GolfCourseLayoutModel,
  MatchPlayerModel,
  ScoresModel,
} from 'src/schemas/models';
import { NullableType } from 'src/shared/types';
import { JwtPayloadType } from '../auth/strategies/types';
import { CreateScoresDto } from 'src/schemas/models/dto';

@Injectable()
export class ScoresService {
  constructor(
    private readonly memberModel: MemberModel,
    private readonly golfCourseLayoutModel: GolfCourseLayoutModel,
    private readonly matchPlayerModel: MatchPlayerModel,
    private readonly scoresModel: ScoresModel,
  ) {}

  async getScoreCardByPlayerId(
    playerId: string,
  ): Promise<NullableType<unknown>> {
    try {
      return this.scoresModel.getScoreCardByPlayerId(playerId);
    } catch (error) {
      this.handleError(error);
    }
  }

  async getScoreCardByPlayerIdAndMatch(
    playerId: string,
    matchId: string,
  ): Promise<NullableType<unknown>> {
    try {
      const score = await this.getHoleScores(matchId, { userId: playerId });
      const scoreDetail = (score as any[])?.find(
        (s) => s.playerId.toString() === playerId,
      );
      return scoreDetail;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getHoleScores(
    matchId: string,
    decoded: JwtPayloadType,
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
            '_id',
            'createdAt',
            'updatedAt',
          ]);

          const playerScores = holeScores.filter(
            (score) => score.playerId.toString() === player.playerId.toString(),
          );

          const filteredScores = playerScores.map((score) =>
            omit(score, ['_id', 'createdAt', 'updatedAt', 'playerId']),
          );

          let totalScore = 0;
          for (const score of filteredScores) {
            const hole = await this.getHoleFromCache(
              score.hole,
              score.golfCourseLayoutId,
              layoutCache,
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
        }),
      );

      return results;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createHoleScores(
    input: CreateScoresDto,
    decoded: JwtPayloadType,
  ): Promise<NullableType<unknown>> {
    try {
      await this.validateUserAndMatch(input.matchId, decoded.userId);
      await this.golfCourseLayoutModel.validateGolfCourseLayout(
        input.golfCourseLayoutId,
        input.hole,
      );
      const existingScore = await this.scoresModel.getHoleScoreByMatchAndHole(
        input.matchId,
        input.hole,
        input.playerId,
      );
      if (existingScore) {
        throw new HttpException(
          'Hole score already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      return this.scoresModel.addHoleScore(input);
    } catch (error) {
      this.handleError(error);
    }
  }

  private async validateUserAndMatch(
    matchId: string,
    userId: string,
  ): Promise<void> {
    const isUserRegistered =
      await this.memberModel.checkUserRegistration(userId);
    if (!isUserRegistered) {
      throw new HttpException('User not registered', HttpStatus.BAD_REQUEST);
    }

    const isPlayerInMatch =
      await this.matchPlayerModel.checkPlayerInMatchExists(matchId, userId);
    if (!isPlayerInMatch) {
      throw new HttpException(
        'Player in match not found',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private handleError(error: any): void {
    const status = error.status || HttpStatus.INTERNAL_SERVER_ERROR;
    throw new HttpException(
      {
        status: false,
        statusCode: status,
        message: error.message || 'Internal server error',
        data: null,
      },
      status,
    );
  }

  private async getHoleFromCache(
    holeNumber: number,
    golfLayoutId: string,
    cache: Map<string, any>,
  ): Promise<any> {
    const cacheKey = `${golfLayoutId}-${holeNumber}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const golfLayout =
      await this.golfCourseLayoutModel.getGolfCourseLayoutById(golfLayoutId);
    const hole = golfLayout?.holes.find(
      (h) => h.hole === holeNumber.toString(),
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
}
