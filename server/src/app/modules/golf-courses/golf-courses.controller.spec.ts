import { Test, TestingModule } from '@nestjs/testing';
import { GolfCoursesController } from './golf-courses.controller';
import { GolfCoursesService } from './golf-courses.service';

describe('GolfCoursesController', () => {
  let controller: GolfCoursesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GolfCoursesController],
      providers: [GolfCoursesService],
    }).compile();

    controller = module.get<GolfCoursesController>(GolfCoursesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
