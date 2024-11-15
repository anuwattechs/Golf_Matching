import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Scores, GolfCoursesLayouts, MatchPlayer } from '..';
import { CreateScoresDto, ScoreCardDto } from './dto';
import { MatchPlayerModel } from './match-players.model';

@Injectable()
export class ScoresModel {
  constructor(
    @InjectModel(Scores.name)
    private holeScoresModel: Model<Scores>,
    private matchPlayerModel: MatchPlayerModel,
  ) {}

  // Add a new hole score
  async addHoleScore(holeScoreData: CreateScoresDto): Promise<Scores> {
    const newHoleScore = new this.holeScoresModel(holeScoreData);
    const holeScore = await newHoleScore.save();
    const { _id: holeScoreId, ...holeScoreRest } = holeScore.toObject();
    return {
      holeScoreId,
      ...holeScoreRest,
    } as unknown as Scores;
  }

  // Get a hole score by ID
  async getHoleScoreById(holeScoreId: string): Promise<Scores> {
    return this.holeScoresModel.findById(holeScoreId).exec();
  }

  // Get all hole scores for a match
  async getHoleScoresForMatch(matchId: string): Promise<Scores[]> {
    return this.holeScoresModel.find({ matchId }).exec();
  }

  // Update hole score details
  async updateHoleScore(holeScoreData: Partial<Scores>): Promise<Scores> {
    return this.holeScoresModel
      .findByIdAndUpdate(holeScoreData, { new: true })
      .exec();
  }

  // Delete a hole score
  async deleteHoleScore(holeScoreId: string): Promise<Scores> {
    return this.holeScoresModel.findByIdAndDelete(holeScoreId).exec();
  }

  async getHoleScoreByMatchAndHole(
    matchId: string,
    hole: number,
    playerId: string,
  ): Promise<Scores> {
    return this.holeScoresModel.findOne({ matchId, hole, playerId });
  }

  async getScoreCardByPlayerId(playerId: string): Promise<ScoreCardDto[]> {
    const allMatchByPlayer =
      await this.matchPlayerModel.getMatchPlayerById(playerId);
    if (allMatchByPlayer.length) {
      const matchIds = allMatchByPlayer.map((match) => match.matchId);
      const holeScores = await this.holeScoresModel.find({
        matchId: { $in: matchIds },
        playerId,
      });
      const matchPlayers = await this.matchPlayerModel.getPlayersForMatch(
        matchIds[0],
      );
      const playerScores = holeScores.reduce((acc, holeScore) => {
        if (!acc[holeScore.matchId]) {
          acc[holeScore.matchId] = [];
        }
        acc[holeScore.matchId].push(holeScore);
        return acc;
      }, {});
      return matchPlayers.map((player) => {
        const playerHoleScores = playerScores[player.matchId];
        const playerScoreCard = playerHoleScores.reduce(
          (acc, holeScore) => {
            acc.totalScore += holeScore.strokes;
            acc.totalPutts += holeScore.putts;
            acc.totalChips += holeScore.chips;
            acc.totalFairways += holeScore.fairways;
            acc.totalGirs += holeScore.girs;
            acc.totalPenalties += holeScore.penalties;
            acc.totalSandSaves += holeScore.sandSaves;
            acc.totalUpAndDowns += holeScore.upAndDowns;
            acc.totalHolesPlayed += 1;
            return acc;
          },
          {
            playerId: player.playerId,
            totalScore: 0,
            totalPutts: 0,
            totalChips: 0,
            totalFairways: 0,
            totalGirs: 0,
            totalPenalties: 0,
            totalSandSaves: 0,
            totalUpAndDowns: 0,
            totalHolesPlayed: 0,
          },
        );
        return {
          ...player.toObject(),
          ...playerScoreCard,
        };
      }) as unknown as ScoreCardDto[];
    }
    return [];
  }
}
