import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateMatchDto, UpdateMatchDto } from 'src/schemas/models/dto';
import { MatchesModel } from '../../../schemas/models/matches.model';
import { NullableType } from 'src/shared/types';
import { Matches } from 'src/schemas';
import { JwtPayloadType } from '../auth/strategies/types';
import { UtilsService } from 'src/shared/utils/utils.service';
import { MemberModel } from 'src/schemas/models';
import { MatchPlayerModel } from '../../../schemas/models/match-players.model';

@Injectable()
export class MatchService {
  constructor(
    private readonly memberModel: MemberModel,
    private readonly matchesModel: MatchesModel,
    private readonly matchPlayerModel: MatchPlayerModel,
    private readonly utilsService: UtilsService,
  ) {}

  // Create a match
  async createMatch(
    input: CreateMatchDto,
    decoded: JwtPayloadType,
  ): Promise<NullableType<unknown>> {
    try {
      // Check if the user is registered
      const userRegistered = await this.memberModel.findById(decoded.userId);
      if (!userRegistered) {
        throw new HttpException(
          this.utilsService.getMessagesTypeSafe('members.USER_NOT_REGISTERED'),
          HttpStatus.BAD_REQUEST,
        );
      }

      // Proceed to create the match
      return await this.matchesModel.create(input, decoded);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Update an existing match
  async updateMatch(input: UpdateMatchDto): Promise<NullableType<unknown>> {
    try {
      return await this.matchesModel.update(input);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Get a match by ID
  async getMatchById(matchId: string): Promise<Matches> {
    try {
      return await this.matchesModel.findById(matchId);
    } catch (error) {
      this.handleError(error);
    }
  }

  async getAllMatches(): Promise<Matches[]> {
    try {
      const matches = await this.matchesModel.findAll();

      // Fetch matches with player details
      const matchesWithPlayers = await Promise.all(
        matches.map(async (match) => {
          const { _id: matchId, ...rest } = match.toObject();
          const playersInMatch =
            await this.matchPlayerModel.getPlayersForMatch(matchId);

          // Fetch player details in parallel
          const players = await Promise.all(
            playersInMatch.map(async (player) => {
              const { _id: playerId, ...playerRest } = player.toObject();

              // Fetch player details
              const playerDetails = await this.memberModel.findById(
                player.playerId,
              );

              // Return player details with member info
              return {
                playerId,
                firstName: playerDetails?.firstName,
                lastName: playerDetails?.lastName,
                nickName: playerDetails?.nickName,
                ...playerRest,
              };
            }),
          );

          // Return match with populated player data
          return {
            matchId,
            ...rest,
            players,
          } as Matches;
        }),
      );

      return matchesWithPlayers;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Centralized error handling
  private handleError(error: any): void {
    throw new HttpException(
      {
        status: false,
        statusCode: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
        data: null,
      },
      error.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
