import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { GolfCourseModel } from 'src/schemas/models';
import { GolfCourse } from 'src/schemas';
import { isArray } from 'class-validator';
import { UtilsService } from 'src/shared/utils/utils.service';

@Injectable()
export class GolfCoursesService {
  constructor(
    private readonly golfCourseModel: GolfCourseModel,
    private readonly utilsService: UtilsService,
  ) {}

  async findAll() {
    try {
      const golfCourses = await this.golfCourseModel.findAll();
      if (!isArray(golfCourses)) {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: this.utilsService.getMessagesTypeSafe(
              'golf-courses.FAILED_TO_FETCH_GOLF_COURSES',
            ),
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return golfCourses.map((golfCourse) => {
        const { _id, ...golfCourseData } = golfCourse.toObject();
        return {
          ...golfCourseData,
          golfCourseId: _id,
        };
      });
    } catch (error) {
      this.handleError(
        this.utilsService.getMessagesTypeSafe(
          'golf-courses.FAILED_TO_FETCH_GOLF_COURSES',
        ),
        error,
      );
    }
  }

  async createGolfCourse(
    createGolfCourseDto: Partial<GolfCourse>,
  ): Promise<GolfCourse> {
    try {
      return await this.golfCourseModel.create(createGolfCourseDto);
    } catch (error) {
      this.handleError(
        this.utilsService.getMessagesTypeSafe(
          'golf-courses.FAILED_TO_CREATE_GOLF_COURSES',
        ),
        error,
      );
    }
  }

  private handleError(message: string, error: any) {
    throw new HttpException(
      {
        status: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message,
        error: error.message || 'Unknown error',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
