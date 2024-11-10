import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HoleScores, GolfCoursesLayouts } from '..';
import { CreateHoleScoresDto } from './dto';

@Injectable()
export class HoleScoresModel {
  constructor(
    @InjectModel(HoleScores.name)
    private holeScoresModel: Model<HoleScores>,
    @InjectModel(GolfCoursesLayouts.name)
    private golfCourseLayoutModel: Model<GolfCoursesLayouts>,
  ) {}

  // Add a new hole score
  async addHoleScore(holeScoreData: CreateHoleScoresDto): Promise<HoleScores> {
    const newHoleScore = new this.holeScoresModel(holeScoreData);
    const holeScore = await newHoleScore.save();
    const { _id: holeScoreId, ...holeScoreRest } = holeScore.toObject();
    return {
      holeScoreId,
      ...holeScoreRest,
    } as unknown as HoleScores;
  }

  // Get a hole score by ID
  async getHoleScoreById(holeScoreId: string): Promise<HoleScores> {
    return this.holeScoresModel.findById(holeScoreId).exec();
  }

  // Get all hole scores for a match
  async getHoleScoresForMatch(matchId: string): Promise<HoleScores[]> {
    return this.holeScoresModel.find({ matchId }).exec();
  }

  // Update hole score details
  async updateHoleScore(
    holeScoreData: Partial<HoleScores>,
  ): Promise<HoleScores> {
    return this.holeScoresModel
      .findByIdAndUpdate(holeScoreData, { new: true })
      .exec();
  }

  // Delete a hole score
  async deleteHoleScore(holeScoreId: string): Promise<HoleScores> {
    return this.holeScoresModel.findByIdAndDelete(holeScoreId).exec();
  }

  async getHoleScoreByMatchAndHole(
    matchId: string,
    hole: number,
    playerId: string,
  ): Promise<HoleScores> {
    return this.holeScoresModel.findOne({ matchId, hole, playerId });
  }
}
