import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MatchesModel, MemberModel } from 'src/schemas/models';
import { CreateMatchRequestDto } from 'src/schemas/models/dto';
import { NullableType } from 'src/shared/types';
import { UtilsService } from 'src/shared/utils/utils.service';
import { JwtPayloadType } from '../auth/strategies/types';
import { MatchRequestModel } from '../../../schemas/models/match-requests.model';
import { MatchRequest } from 'src/schemas';

@Injectable()
export class MatchRequestsService {
  constructor(
    private readonly memberModel: MemberModel,
    private readonly matchRequestModel: MatchRequestModel,
    private readonly matchesModel: MatchesModel,
    private readonly utilsService: UtilsService,
  ) {}

  // Create a match request
  async createMatchRequest(
    input: CreateMatchRequestDto,
    decoded: JwtPayloadType,
  ): Promise<NullableType<unknown>> {
    try {
      await this.checkUserRegistration(decoded.userId);

      const match = await this.matchesModel.findById(input.matchId);
      if (!match) {
        throw new HttpException('Match not found', HttpStatus.NOT_FOUND);
      }

      // Check if the user is the host of the match
      if (match.createdBy.toString() === decoded.userId) {
        throw new HttpException(
          "You can't request a match with yourself",
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check if a match request already exists
      const existingRequest =
        await this.matchRequestModel.getRequestsByPlayerAndMatch(
          decoded.userId,
          input.matchId,
        );

      if (existingRequest.length) {
        throw new HttpException(
          'You have already requested a match with this player',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Create the match request
      return await this.matchRequestModel.createMatchRequest(input, decoded);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Accept or decline a match request
  async respondToMatchRequest(
    input: { requestId: string; status: 'ACCEPTED' | 'DECLINED' },
    decoded: JwtPayloadType,
  ): Promise<NullableType<unknown>> {
    try {
      await this.checkUserRegistration(decoded.userId);

      const matchRequest = await this.matchRequestModel.getMatchRequestById(
        input.requestId,
      );

      if (!matchRequest) {
        throw new HttpException(
          'Match request not found',
          HttpStatus.NOT_FOUND,
        );
      }

      const match = await this.matchesModel.findById(matchRequest.matchId);
      if (!match) {
        throw new HttpException('Match not found', HttpStatus.NOT_FOUND);
      }

      // Ensure the user is the host of the match to respond to the request
      if (match.createdBy.toString() !== decoded.userId) {
        throw new HttpException(
          `You can't ${
            input.status.toLowerCase() === 'accepted' ? 'accept' : 'decline'
          } this match request as you are not the host`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // Update the match request status
      return await this.matchRequestModel.updateRequestStatus(
        input.requestId,
        input.status,
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  // Get all match requests
  async getAllMatchRequests(): Promise<MatchRequest[]> {
    try {
      const allRequestMatches =
        await this.matchRequestModel.getAllMatchRequests();
      return allRequestMatches?.map((request) => {
        const { _id: requestId, ...rest } = request.toObject();
        return { requestId, ...rest };
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  // Helper method to check if user is registered
  private async checkUserRegistration(userId: string): Promise<void> {
    const user = await this.memberModel.findById(userId);
    if (!user) {
      throw new HttpException(
        this.utilsService.getMessagesTypeSafe('members.USER_NOT_REGISTERED'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Centralized error handling
  private handleError(error: any): void {
    throw new HttpException(
      {
        status: false,
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'Internal server error',
        data: null,
      },
      error.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
