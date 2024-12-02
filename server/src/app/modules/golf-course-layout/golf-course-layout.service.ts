import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  GolfCourseLayoutModel,
  GolfCourseModel,
  MemberModel,
} from 'src/schemas/models';
import { UtilsService } from 'src/shared/utils/utils.service';
import { NullableType } from 'src/shared/types';
import { CreateGolfCourseLayoutDto } from '../../../schemas/models/dto/golf-course-layout.dto';
import { JwtPayloadType } from '../auth/strategies/types';

@Injectable()
export class GolfCourseLayoutService {
  constructor(
    private readonly memberModel: MemberModel,
    private readonly utilsService: UtilsService,
    private readonly golfCourseLayoutModel: GolfCourseLayoutModel,
    private readonly golfCourseModel: GolfCourseModel,
  ) {}

  // Get all golf course layouts
  async getGolfCourseLayouts(
    golfCourseId: string,
  ): Promise<NullableType<unknown>> {
    try {
      return await this.golfCourseLayoutModel.getGolfCourseLayoutById(
        golfCourseId,
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  // Create a golf course layout
  async createGolfCourseLayout(
    input: CreateGolfCourseLayoutDto,
    decoded: JwtPayloadType,
  ): Promise<NullableType<unknown>> {
    try {
      await this.checkUserRegistration(decoded.userId);
      await this.checkGolfCourseExists(input.golfCourseId);
      return await this.golfCourseLayoutModel.addGolfCourseLayout(input);
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

  // Helper method to check if golf course exists
  private async checkGolfCourseExists(golfCourseId: string): Promise<void> {
    const golfCourse = await this.golfCourseModel.findById(golfCourseId);
    if (!golfCourse) {
      throw new HttpException(
        "Golf course doesn't exist",
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
