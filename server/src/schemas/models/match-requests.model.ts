import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MatchPlayer, MatchRequest, Matches } from '..';
import { CreateMatchRequestDto } from './dto';
import { JwtPayloadType } from 'src/app/modules/auth/strategies/types';
import { MatchesModel } from './matches.model';

@Injectable()
export class MatchRequestModel {
  constructor(
    @InjectModel(MatchRequest.name)
    private matchRequestModel: Model<MatchRequest>,
    @InjectModel(MatchPlayer.name)
    private readonly matchesPlayerModel: Model<MatchPlayer>,
    @InjectModel(Matches.name)
    private readonly matchesModel: Model<MatchesModel>,
  ) {}

  // Get all match requests
  async getAllMatchRequests(): Promise<MatchRequest[]> {
    try {
      return await this.matchRequestModel.find().exec();
    } catch (error) {
      throw new HttpException('Error fetching all match requests', 500);
    }
  }

  // Create a new match request
  async createMatchRequest(
    createMatchRequestDto: CreateMatchRequestDto,
    decoded: JwtPayloadType,
  ): Promise<MatchRequest> {
    const createdRequest = new this.matchRequestModel({
      ...createMatchRequestDto,
      playerId: decoded.userId,
      status: 'REQUESTED',
      requestedAt: new Date(),
    });
    const match = await this.matchesModel.findById(
      createMatchRequestDto.matchId,
    );

    if (!match) {
      throw new HttpException('Match not found', 404);
    }

    try {
      return await createdRequest.save();
    } catch (error) {
      throw new HttpException('Error creating match request', 500);
    }
  }

  // Get match request by ID
  async getMatchRequestById(requestId: string): Promise<MatchRequest | null> {
    try {
      return await this.matchRequestModel.findById(requestId).exec();
    } catch (error) {
      throw new HttpException('Error fetching match request by ID', 500);
    }
  }

  // Get all requests for a match
  async getRequestsForMatch(matchId: string): Promise<MatchRequest[]> {
    try {
      return await this.matchRequestModel.find({ matchId }).exec();
    } catch (error) {
      throw new HttpException('Error fetching requests for match', 500);
    }
  }

  // Get requests by player ID and match ID
  async getRequestsByPlayerAndMatch(
    playerId: string,
    matchId: string,
  ): Promise<MatchRequest[]> {
    try {
      return await this.matchRequestModel.find({ playerId, matchId }).exec();
    } catch (error) {
      throw new HttpException(
        'Error fetching requests by player and match',
        500,
      );
    }
  }

  // Update match request status (e.g., accepted or declined)
  async updateRequestStatus(
    requestId: string,
    status: string,
  ): Promise<MatchRequest | null> {
    try {
      const updatedRequest = await this.matchRequestModel
        .findByIdAndUpdate(requestId, { status }, { new: true })
        .exec();

      if (!updatedRequest) {
        throw new HttpException('Request not found', 404);
      }

      if (status === 'ACCEPTED') {
        await this.addPlayerToMatch(updatedRequest);
      }

      return updatedRequest;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error updating match request status',
        error.status || 500,
      );
    }
  }

  // Helper method to add player to match when accepted
  private async addPlayerToMatch(request: MatchRequest): Promise<void> {
    try {
      const match = await this.matchesPlayerModel.findOne({
        matchId: request.matchId,
        playerId: request.playerId,
      });

      if (match) {
        throw new HttpException('Player already added to match', 400);
      }

      await this.matchesPlayerModel.create({
        matchId: request.matchId,
        playerId: request.playerId,
        isHost: false,
        joinedAt: new Date(),
        caddieSelection: request.caddieSelection,
        caddieId: request.caddieId,
        caddieInfo: request.caddieInfo,
      });
    } catch (error) {
      throw new HttpException(
        error.message || 'Error adding player to match',
        error.status || 500,
      );
    }
  }

  // Delete match request by ID
  async deleteMatchRequest(requestId: string): Promise<MatchRequest | null> {
    try {
      const deletedRequest = await this.matchRequestModel
        .findByIdAndDelete(requestId)
        .exec();
      if (!deletedRequest) {
        throw new HttpException('Request not found', 404);
      }
      return deletedRequest;
    } catch (error) {
      throw new HttpException('Error deleting match request', 500);
    }
  }
}
