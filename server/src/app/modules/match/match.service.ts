import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateMatchDto,
  MatchesHistoryDto,
  ResultPaginationMatchesHistoryDto,
  UpdateMatchDto,
} from 'src/schemas/models/dto';
import { MatchesModel } from '../../../schemas/models/matches.model';
import { NullableType } from 'src/shared/types';
import { Matches } from 'src/schemas';
import { JwtPayloadType } from '../auth/strategies/types';
import { UtilsService } from 'src/shared/utils/utils.service';
import { GolfCourseModel, MemberModel } from 'src/schemas/models';
import { MatchPlayerModel } from '../../../schemas/models/match-players.model';
import { ScoresService } from '../scores/scores.service';
import { ResultPaginationDto } from 'src/shared/dto';

@Injectable()
export class MatchService {
  constructor(
    private readonly memberModel: MemberModel,
    private readonly matchesModel: MatchesModel,
    private readonly matchPlayerModel: MatchPlayerModel,
    private readonly scoresService: ScoresService,
    private readonly utilsService: UtilsService,
    private readonly golfCourseModel: GolfCourseModel,
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
      const match = await this.matchesModel.findById(matchId);

      if (!match) {
        throw new HttpException("Match doesn't exist", HttpStatus.NOT_FOUND);
      }

      const { _id: id, ...rest } = match.toObject();

      return {
        matchId: id,
        ...rest,
      };
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

  async getMatchHistory(
    decoded: JwtPayloadType,
    page: number,
    limit: number,
  ): Promise<ResultPaginationMatchesHistoryDto> {
    const {
      data: matchesByMemberIds,
      total,
      page: _,
      limit: _1,
      totalPages,
      hasNextPage,
      hasPrevPage,
    } = await this.matchesModel.getMathHistory(decoded.userId, page, limit);

    if (!matchesByMemberIds) {
      return {
        result: [],
        pagination: {
          total: 0,
          page,
          limit,
          totalPages: 0,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    }

    const result = await Promise.all(
      matchesByMemberIds.map(async (match: Matches) => {
        const {
          _id: matchId,
          courseId,
          title,
          description,
          coverImageUrl,
          date,
          matchesType,
          maxPlayers,
        } = match;

        const scores =
          await this.scoresService.getScoreCardByPlayerIdWithOldPagination(
            decoded.userId,
          );

        const players = await this.matchPlayerModel.getPlayersForMatch(matchId);

        const playerScore = scores?.find(
          (score) => score.matchId.toString() === matchId.toString(),
        );

        const course = await this.golfCourseModel.findById(courseId);
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
          title: title || '',
          description: description || '',
          courseId: courseId || '',
          courseName,
          address,
          coverImageUrl: coverImageUrl || course.coverImage[0],
          date,
          matchesType: matchesType || '',
          maxPlayers: maxPlayers || 0,
          currentPlayers: players.length || 0,
          myScore: playerScore?.myScore || 0,
        };
      }),
    );

    return {
      result: result,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
    };
  }
}
