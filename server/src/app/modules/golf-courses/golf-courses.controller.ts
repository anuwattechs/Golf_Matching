import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  BadRequestException,
  UsePipes,
  ValidationPipe,
  InternalServerErrorException,
} from '@nestjs/common';
import { GolfCoursesService } from './golf-courses.service';
import { JwtAuthGuard, BlockGuard } from '../auth/guard';
import { ResponseMessage } from 'src/app/common/decorator/response-message.decorator';

@Controller('golf-courses')
export class GolfCoursesController {
  constructor(private readonly golfCoursesService: GolfCoursesService) {}

  @Get()
  async findAll() {
    return this.golfCoursesService.findAll();
  }

  @Post()
  @UseGuards(BlockGuard)
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('golf-courses.GOLF_COURSE_CREATED_SUCCESSFULLY')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() createGolfCourseDto: any) {
    try {
      return await this.golfCoursesService.createGolfCourse(
        createGolfCourseDto,
      );
    } catch (error) {
      console.error(error); // Log the entire error for debugging
      throw this.handleError(error);
    }
  }

  private handleError(error: any) {
    const statusCode = error?.response?.status || 500; // Default to 500 if no status is found
    const message = error?.response?.error || 'Internal Server Error';

    // Throwing specific exception based on the error type
    if (statusCode === 400) {
      throw new BadRequestException({
        status: false,
        statusCode,
        message,
        data: null,
      });
    }

    throw new InternalServerErrorException({
      status: false,
      statusCode,
      message,
      data: null,
    });
  }
}
