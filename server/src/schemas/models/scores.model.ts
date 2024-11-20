import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Scores } from '..';
import { CreateScoresDto, ScoreCardDto } from './dto';
import { MatchPlayerModel } from './match-players.model';
import { MatchesModel } from './matches.model';
import { GolfCourseLayoutModel } from './golf-course-layout.model';
import { GolfCourseModel } from './golf-course.model';

@Injectable()
export class ScoresModel {
  constructor(
    @InjectModel(Scores.name)
    private readonly holeScoresModel: Model<Scores>,
    private readonly matchPlayerModel: MatchPlayerModel,
    private readonly matchesModel: MatchesModel,
    private readonly golfCourseLayoutModel: GolfCourseLayoutModel,
    private readonly golfCourseModel: GolfCourseModel,
  ) {}

  // Add a new hole score
  async addHoleScore(holeScoreData: CreateScoresDto): Promise<Scores> {
    try {
      const newHoleScore = await this.holeScoresModel.create(holeScoreData);
      return newHoleScore.toObject();
    } catch (error) {
      throw new HttpException(
        'Failed to add hole score',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Get a hole score by ID
  async getHoleScoreById(holeScoreId: string): Promise<Scores> {
    const holeScore = await this.holeScoresModel.findById(holeScoreId).lean();
    if (!holeScore) {
      throw new HttpException('Hole score not found', HttpStatus.NOT_FOUND);
    }
    return holeScore;
  }

  // Get all hole scores for a match
  async getHoleScoresForMatch(matchId: string): Promise<Scores[]> {
    return this.holeScoresModel.find({ matchId }).lean();
  }

  // Update hole score details
  async updateHoleScore(
    holeScoreId: string,
    holeScoreData: Partial<Scores>,
  ): Promise<Scores> {
    const updatedHoleScore = await this.holeScoresModel
      .findByIdAndUpdate(holeScoreId, holeScoreData, { new: true })
      .lean();

    if (!updatedHoleScore) {
      throw new HttpException(
        'Failed to update hole score',
        HttpStatus.NOT_FOUND,
      );
    }
    return updatedHoleScore;
  }

  // Delete a hole score
  async deleteHoleScore(holeScoreId: string): Promise<Scores> {
    const deletedHoleScore = await this.holeScoresModel
      .findByIdAndDelete(holeScoreId)
      .lean();

    if (!deletedHoleScore) {
      throw new HttpException('Hole score not found', HttpStatus.NOT_FOUND);
    }
    return deletedHoleScore;
  }

  // Get a hole score by match, hole, and player
  async getHoleScoreByMatchAndHole(
    matchId: string,
    hole: number,
    playerId: string,
  ): Promise<Scores> {
    return this.holeScoresModel.findOne({ matchId, hole, playerId }).lean();
  }

  async getScoreCardByPlayerId(playerId: string): Promise<ScoreCardDto[]> {
    try {
      const allMatchByPlayer =
        await this.matchPlayerModel.getMatchPlayerById(playerId);
      const matchIds = allMatchByPlayer.map((player) => player.matchId);

      const playerMatches = (await this.matchesModel.findAll()).filter(
        (match) => matchIds.includes(match._id.toString()),
      );

      const layoutCache = new Map<string, any>();
      const courseCache = new Map<string, any>();

      const scoreCards: ScoreCardDto[] = await Promise.all(
        playerMatches.map(async (match) => {
          const { courseId, _id: matchId, date, maxPlayers } = match;

          const scores = await this.holeScoresModel.find({
            matchId,
            playerId,
          });

          const { myScore, overScore, fairways, puttsRound, puttsHole } =
            await this.calculateTotalScore(scores, layoutCache);

          let course = courseCache.get(courseId);
          if (!course) {
            course = await this.golfCourseModel.findById(courseId);
            courseCache.set(courseId, course);
          }

          const courseName = course?.name || '';
          const address = {
            street1: course?.address?.street1 || '',
            street2: course?.address?.street2 || '',
            city: course?.address?.city || '',
            state: course?.address?.state || '',
            country: course?.address?.country || '',
            postalCode: course?.address?.postalCode || '',
          };

          return {
            matchId,
            playerId,
            date,
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
        }),
      );

      return scoreCards;
    } catch (error) {
      console.error('Error in getScoreCardByPlayerId:', error.message);
      throw new HttpException(
        'Failed to get score card',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Helper function to calculate total score
  private async calculateTotalScore(
    scores: Scores[],
    layoutCache: Map<string, any>,
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
        layoutCache,
      );
      const hole = layout.holes.find(
        (h: { hole: string }) => h.hole === score.hole.toString(),
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

    // Calculate Fairway Hit percentage using a helper function
    const totalFairways = await this.calculateFairwayHitPercentage(
      scores,
      layoutCache,
    );

    return {
      myScore: totalScore,
      overScore: totalOverScore,
      fairways: totalFairways,
      puttsRound: totalPuttsRound,
      puttsHole: puttsHole,
    };
  }

  // Helper function to get golf course layout with caching
  private async getGolfCourseLayoutFromCache(
    golfCourseLayoutId: string,
    cache: Map<string, any>,
  ): Promise<any> {
    if (cache.has(golfCourseLayoutId)) {
      return cache.get(golfCourseLayoutId);
    }

    const layout =
      await this.golfCourseLayoutModel.getGolfCourseLayoutById(
        golfCourseLayoutId,
      );
    cache.set(golfCourseLayoutId, layout);

    return layout;
  }

  // Helper function to calculate score
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

  // Helper function to calculate Fairway Hit percentage
  private async calculateFairwayHitPercentage(
    scores: Scores[],
    layoutCache: Map<string, any>,
  ): Promise<number> {
    let totalFairways = 0;
    let totalPar4AndPar5Holes = 0;

    // Loop through each score
    for (const score of scores) {
      // Fetch golf course layout from cache
      const layout = await this.getGolfCourseLayoutFromCache(
        score.golfCourseLayoutId,
        layoutCache,
      );
      // Find the hole in the layout
      const hole = layout.holes.find(
        (h: { hole: string }) => h.hole === score.hole.toString(),
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
}
