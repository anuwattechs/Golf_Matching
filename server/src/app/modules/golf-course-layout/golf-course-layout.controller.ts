import { Body, Controller, Param, Req, UseGuards } from '@nestjs/common';
import { GolfCourseLayoutService } from './golf-course-layout.service';
import { CreateGolfCourseLayoutDto } from 'src/schemas/models/dto';
import { Post, Get } from '@nestjs/common';
import { JwtPayloadType } from '../auth/strategies/types';
import { BlockGuard, JwtAuthGuard } from '../auth/guard';

@Controller('golf-course-layout')
export class GolfCourseLayoutController {
  constructor(
    private readonly golfCourseLayoutService: GolfCourseLayoutService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseGuards(BlockGuard)
  async createGolfCourseLayout(
    @Body() createGolfCourseDto: CreateGolfCourseLayoutDto,
    @Req() req: Request & { decoded: JwtPayloadType },
  ) {
    return await this.golfCourseLayoutService.createGolfCourseLayout(
      createGolfCourseDto,
      req.decoded,
    );
  }

  @Get(':golfCourseId')
  async getGolfCourseLayouts(@Param('golfCourseId') golfCourseId: string) {
    return this.golfCourseLayoutService.getGolfCourseLayouts(golfCourseId);
  }
}
