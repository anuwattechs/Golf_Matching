import { Module } from '@nestjs/common';
import { GolfCoursesService } from './golf-courses.service';
import { GolfCoursesController } from './golf-courses.controller';

@Module({
  controllers: [GolfCoursesController],
  providers: [GolfCoursesService],
})
export class GolfCoursesModule {}
