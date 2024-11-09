import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MatchPlayer } from '..';
import { CreateMatchPlayerDto, UpdateMatchPlayerDto } from './dto';

@Injectable()
export class MatchPlayerModel {
  constructor(
    @InjectModel(MatchPlayer.name) private matchPlayerModel: Model<MatchPlayer>,
  ) {}

  // Add a player to a match
  async addPlayerToMatch(
    createMatchPlayerDto: CreateMatchPlayerDto,
  ): Promise<MatchPlayer> {
    const createdPlayer = new this.matchPlayerModel(createMatchPlayerDto);
    return createdPlayer.save();
  }

  // Get match player by ID
  async getMatchPlayerById(playerId: string): Promise<MatchPlayer> {
    return this.matchPlayerModel.findById(playerId).exec();
  }

  // Get all players for a match
  async getPlayersForMatch(matchId: string): Promise<MatchPlayer[]> {
    return this.matchPlayerModel.find({ matchId }).exec();
  }

  // Update player details (e.g., caddie info, selection status)
  async updatePlayerDetails(
    updateData: Partial<UpdateMatchPlayerDto>,
  ): Promise<MatchPlayer> {
    return this.matchPlayerModel
      .findByIdAndUpdate(updateData, { new: true })
      .exec();
  }

  // Delete player from match
  async deletePlayerFromMatch(playerId: string): Promise<MatchPlayer> {
    return this.matchPlayerModel.findByIdAndDelete(playerId).exec();
  }
}
