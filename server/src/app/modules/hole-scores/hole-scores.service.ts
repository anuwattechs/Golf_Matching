import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  MemberModel,
  GolfCourseLayoutModel,
  HoleScoresModel,
  MatchPlayerModel,
} from 'src/schemas/models';
import { CreateHoleScoresDto } from 'src/schemas/models/dto';
import { NullableType } from 'src/shared/types';
import { UtilsService } from 'src/shared/utils/utils.service';
import { JwtPayloadType } from '../auth/strategies/types';
import { omit } from 'lodash';
import { HoleScores } from 'src/schemas';

@Injectable()
export class HoleScoresService {
  constructor(
    private readonly memberModel: MemberModel,
    private readonly utilsService: UtilsService,
    private readonly golfCourseLayoutModel: GolfCourseLayoutModel,
    private readonly matchPlayerModel: MatchPlayerModel,
    private readonly holeScoresModel: HoleScoresModel,
  ) {}

  async getHoleScores(
    matchId: string,
    decoded: JwtPayloadType,
  ): Promise<NullableType<unknown>> {
    try {
      await this.validateUserAndMatch(matchId, decoded.userId);

      const [players, holeScores] = await Promise.all([
        this.matchPlayerModel.getPlayersForMatch(matchId),
        this.holeScoresModel.getHoleScoresForMatch(matchId),
      ]);

      // สร้าง cache สำหรับ golf course layout เพื่อใช้ซ้ำ
      const layoutCache = new Map();

      const results = await Promise.all(
        players.map(async (player) => {
          const filteredPlayer = omit(player.toObject(), [
            '_id',
            'createdAt',
            'updatedAt',
          ]);

          // กรองคะแนนของผู้เล่นคนนี้
          const playerScores = holeScores.filter(
            (score) => score.playerId.toString() === player.playerId.toString(),
          );

          const filteredScores = playerScores.map((score) =>
            omit(score.toObject(), [
              '_id',
              'createdAt',
              'updatedAt',
              'playerId',
            ]),
          );

          // คำนวณ totalScore โดยไม่ใช้ reduce ที่เป็น async
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

  // Create hole scores
  async createHoleScores(
    input: CreateHoleScoresDto,
    decoded: JwtPayloadType,
  ): Promise<NullableType<unknown>> {
    try {
      await this.validateUserAndMatch(input.matchId, decoded.userId);
      await this.validateGolfCourseLayout(input.golfCourseLayoutId, input.hole);
      const existingScore =
        await this.holeScoresModel.getHoleScoreByMatchAndHole(
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

      return this.holeScoresModel.addHoleScore(input);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Validate user registration and player participation in the match
  private async validateUserAndMatch(
    matchId: string,
    userId: string,
  ): Promise<void> {
    await this.checkUserRegistration(userId);
    await this.checkPlayerInMatchExists(matchId, userId);
  }

  // Check if the user is registered
  private async checkUserRegistration(userId: string): Promise<void> {
    const user = await this.memberModel.findById(userId);
    if (!user) {
      throw new HttpException(
        this.utilsService.getMessagesTypeSafe('members.USER_NOT_REGISTERED'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Check if the player exists in the match
  private async checkPlayerInMatchExists(
    matchId: string,
    playerId: string,
  ): Promise<void> {
    const player = await this.matchPlayerModel.getPlayerByMatchAndPlayerId(
      matchId,
      playerId,
    );
    if (!player) {
      throw new HttpException(
        'Player in match not found',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Validate the golf course layout and hole number
  private async validateGolfCourseLayout(
    golfCourseLayoutId: string,
    holeNumber: number,
  ): Promise<void> {
    const golfCourseLayout =
      await this.golfCourseLayoutModel.getGolfCourseLayoutById(
        golfCourseLayoutId,
      );
    if (!golfCourseLayout) {
      throw new HttpException(
        'Golf course layout not found',
        HttpStatus.BAD_REQUEST,
      );
    }

    const holeExists = golfCourseLayout.holes.some(
      (hole) => hole.hole === holeNumber.toString(),
    );
    if (!holeExists) {
      throw new HttpException('Hole number not found', HttpStatus.BAD_REQUEST);
    }
  }

  // Centralized error handling
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

  // ฟังก์ชันสำหรับดึงข้อมูลหลุมจาก cache หรือ database
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
