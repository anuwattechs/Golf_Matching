import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { GolfCourseModel } from 'src/schemas/models';
import { GolfCourse } from 'src/schemas';
import { isArray } from 'class-validator';

@Injectable()
export class GolfCoursesService {
  constructor(private readonly golfCourseModel: GolfCourseModel) {}

  async findAll() {
    try {
      const golfCourses = await this.golfCourseModel.findAll();
      if (!isArray(golfCourses)) {
        throw new HttpException(
          {
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Invalid response from the database',
            error: 'Failed to fetch golf courses',
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
      this.handleError('Failed to fetch golf courses', error);
    }
  }

  async createGolfCourse(
    createGolfCourseDto: Partial<GolfCourse>,
  ): Promise<GolfCourse> {
    try {
      return await this.golfCourseModel.create(createGolfCourseDto);
    } catch (error) {
      this.handleError('Failed to create golf course', error);
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
