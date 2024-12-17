import {
  Controller,
  Get,
  Req,
  UseGuards,
  Query,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  HttpException,
  HttpStatus,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { MatchService } from './match.service';
import {
  CreateMatchDto,
  ResultPaginationMatchesHistoryDto,
} from '../../../schemas/models/dto/match.dto';
import { JwtAuthGuard } from '../auth/guard';
import { JwtPayloadType } from '../auth/strategies/types';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from 'src/app/common/services/aws/aws.service';

@Controller('match')
export class MatchController {
  constructor(
    private readonly matchService: MatchService,
    private readonly awsService: AwsService,
  ) {}

  /**
   * Get all matches
   * @returns List of all matches
   */
  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllMatches(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() req: Request & { decoded: JwtPayloadType },
  ) {
    if (page < 1) {
      page = 1;
    }
    if (limit < 1) {
      limit = 10;
    }

    return await this.matchService.getAllMatches(req.decoded, page, limit);
  }

  /**
   * Get the match history of the logged-in user
   * @param req The request object containing the decoded JWT payload
   * @returns List of matches history
   */
  @Get('history/me')
  @UseGuards(JwtAuthGuard)
  async getMatchHistory(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() req: Request & { decoded: JwtPayloadType },
  ): Promise<ResultPaginationMatchesHistoryDto> {
    if (page < 1) {
      page = 1;
    }
    if (limit < 1) {
      limit = 10;
    }
    return await this.matchService.getMatchHistory(req.decoded, page, limit);
  }

  /**
   * Create a new match
   * @param body The data required to create a new match
   * @param req The request object containing the decoded JWT payload
   * @returns The newly created match
   */
  // @Post()
  // @UseGuards(JwtAuthGuard)
  // async createMatch(
  //   @Body() body: CreateMatchDto,
  //   @Req() req: Request & { decoded: JwtPayloadType }
  // ) {
  //   return await this.matchService.createMatch(body, req.decoded);
  // }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('coverImageUrl'))
  async createMatch(
    @Body() createMatchDto: CreateMatchDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({
            maxSize: 30 * 1024 * 1024, // 30MB limit
            message: `File is too large. Max file size is 30MB`,
          }),
        ],
        fileIsRequired: false,
      }),
    )
    coverImageUrl: Express.Multer.File,
    @Req() req: Request & { decoded: JwtPayloadType },
  ) {
    if (coverImageUrl) {
      const uploadResult = await this.awsService.uploadFile(
        process.env.AWS_DEFAULT_S3_BUCKET,
        `matches/${req.decoded.userId}/cover-image/${uuidv4()}.${coverImageUrl.originalname.split('.').pop()}`,
        coverImageUrl.buffer,
        coverImageUrl.mimetype,
      );

      if (!uploadResult) {
        throw new HttpException(
          'Failed to upload cover image',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      createMatchDto.coverImageUrl = uploadResult.Key;
    } else {
      createMatchDto.coverImageUrl = null;
    }

    return await this.matchService.createMatch(createMatchDto, req.decoded);
  }
}
