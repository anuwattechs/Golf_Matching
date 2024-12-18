import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreateMatchDto,
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
import { AwsService } from 'src/app/common/services/aws/aws.service';
import { AssetsService } from '../assets/assets.service';

@Injectable()
export class MatchService {
  constructor(
    private readonly memberModel: MemberModel,
    private readonly matchesModel: MatchesModel,
    private readonly matchPlayerModel: MatchPlayerModel,
    private readonly scoresService: ScoresService,
    private readonly utilsService: UtilsService,
    private readonly golfCourseModel: GolfCourseModel,
    private readonly awsService: AwsService,
    private readonly assetsService: AssetsService,
  ) {}

  // Create a match
  async createMatch(
    input: CreateMatchDto,
    decoded: JwtPayloadType,
    // fileCoverImage: Express.Multer.File
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

      const {
        title,
        courseId,
        datetime,
        holeType,
        matchesType,
        coverImageUrl,
        description,
        ...matchDetails
      } = input;

      const parsedBodySOLO = {
        ...matchDetails,
        title,
        description,
        courseId,
        datetime,
        holeType,
        matchesType,
        coverImageUrl,
        costPerPerson: null,
        handicap: null,
        averageScore: null,
        transportMode: null,
        maxPlayers: 1,
        tags: '',
        gender: null,
      };

      const payload =
        matchesType === 'SOLO'
          ? parsedBodySOLO
          : {
              ...input,
              coverImageUrl,
            };

      const result = (
        await this.matchesModel.create(payload, decoded)
      ).toObject();
      const { _id: matchId, ...rest } = result;
      return {
        matchId,
        ...rest,
      };
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

  async getAllMatches(
    decoded: JwtPayloadType,
    page: number,
    limit: number,
  ): Promise<NullableType<unknown>> {
    try {
      const { data: result, ...matchesWithPagination } =
        await this.utilsService.findAllWithPaginationAndFilter(
          this.matchesModel.rootMatchModel(),
          page,
          limit,
          {},
        );

      const matchesWithPlayers = await Promise.all(
        result.map(async (match) => {
          const { _id: matchId, ...rest } = match;
          const playersInMatch =
            await this.matchPlayerModel.getPlayersForMatch(matchId);

          if (rest.coverImageUrl !== null) {
            const coverImageUrl = await this.awsService.getSignedUrl(
              process.env.AWS_DEFAULT_S3_BUCKET,
              rest.coverImageUrl,
              {
                Expires: 60 * 60 * 24 * 10,
              },
            );
            rest.coverImageUrl = coverImageUrl;
          }

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

          const tags = await this.assetsService.getTags({
            isPublic: false,
          });

          const matchTags = tags?.filter((tag) =>
            rest.tags?.includes(tag.tagId),
          );

          // Return match with populated player data
          return {
            ...rest,
            tags: matchTags,
            matchId,
            players,
          };
        }),
      );

      return {
        result: matchesWithPlayers,
        ...matchesWithPagination,
      };
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
          datetime,
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

        //TODO: IMPLEMENT SCORE CALCULATION LOGIC
        const score = {
          myScore: this.utilsService.parseNumberToString(276),
          overScore: this.utilsService.parseNumberToString(9),
          fairways: `${this.utilsService.parseNumberToString(57.14)}%`,
          puttsRound: this.utilsService.parseNumberToString(28),
          puttsHole: this.utilsService.parseNumberToString(1.56),
        };

        //TODO: IMPLEMENT MATCH STATUS LOGIC
        const matchStatus = 'LIVE';
        const image = await this.awsService.getSignedUrl(
          process.env.AWS_DEFAULT_S3_BUCKET,
          coverImageUrl || course.coverImage[0],
          {
            Expires: 60 * 60 * 24 * 10, // 10 days
          },
        );

        return {
          matchId,
          title: title || '',
          description: description || '',
          courseId: courseId || '',
          courseName,
          address,
          coverImageUrl: image,
          datetime: datetime,
          matchType: matchesType || '',
          maxPlayers: maxPlayers || 0,
          currentPlayers: players.length || 0,
          score: {
            ...score,
          },
          matchStatus: matchStatus || '',
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
