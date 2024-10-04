import { Controller } from '@nestjs/common';
import { GolfCoursesService } from './golf-courses.service';

@Controller('golf-courses')
export class GolfCoursesController {
  constructor(private readonly golfCoursesService: GolfCoursesService) {}
}
