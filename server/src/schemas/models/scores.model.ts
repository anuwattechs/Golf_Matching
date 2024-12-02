import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Scores } from '..';
import { CreateScoresDto } from './dto';

@Injectable()
export class ScoresModel {
  constructor(
    @InjectModel(Scores.name)
    private readonly holeScoresModel: Model<Scores>,
  ) {}

  /**
   * Add a new hole score.
   * @param holeScoreData - Data for the new hole score.
   */
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

  /**
   * Find hole scores by match ID and player ID.
   * @param matchId - ID of the match.
   * @param playerId - ID of the player.
   */
  async findHoleScoreByMatchIdAndPlayerId(
    matchId: string,
    playerId: string,
  ): Promise<Scores[]> {
    return this.holeScoresModel.find({ matchId, playerId }).lean();
  }

  /**
   * Get a hole score by ID.
   * @param holeScoreId - ID of the hole score.
   */
  async getHoleScoreById(holeScoreId: string): Promise<Scores> {
    const holeScore = await this.holeScoresModel.findById(holeScoreId).lean();
    if (!holeScore) {
      throw new HttpException('Hole score not found', HttpStatus.NOT_FOUND);
    }
    return holeScore;
  }

  /**
   * Get all hole scores for a specific match.
   * @param matchId - ID of the match.
   */
  async getHoleScoresForMatch(matchId: string): Promise<Scores[]> {
    return this.holeScoresModel.find({ matchId }).lean();
  }

  /**
   * Update details of a specific hole score.
   * @param holeScoreId - ID of the hole score to update.
   * @param holeScoreData - Partial data to update the hole score.
   */
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

  /**
   * Delete a specific hole score by ID.
   * @param holeScoreId - ID of the hole score to delete.
   */
  async deleteHoleScore(holeScoreId: string): Promise<Scores> {
    const deletedHoleScore = await this.holeScoresModel
      .findByIdAndDelete(holeScoreId)
      .lean();

    if (!deletedHoleScore) {
      throw new HttpException('Hole score not found', HttpStatus.NOT_FOUND);
    }
    return deletedHoleScore;
  }

  /**
   * Get a hole score by match ID, hole number, and player ID.
   * @param matchId - ID of the match.
   * @param hole - Hole number.
   * @param playerId - ID of the player.
   */
  async getHoleScoreByMatchAndHole(
    matchId: string,
    hole: number,
    playerId: string,
  ): Promise<Scores> {
    const holeScore = await this.holeScoresModel
      .findOne({
        matchId,
        hole,
        playerId,
      })
      .lean();

    if (!holeScore) {
      throw new HttpException(
        'Hole score not found for the given match, hole, and player',
        HttpStatus.NOT_FOUND,
      );
    }

    return holeScore;
  }
}
