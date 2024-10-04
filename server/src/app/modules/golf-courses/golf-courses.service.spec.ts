import { Test, TestingModule } from '@nestjs/testing';
import { GolfCoursesService } from './golf-courses.service';

describe('GolfCoursesService', () => {
  let service: GolfCoursesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GolfCoursesService],
    }).compile();

    service = module.get<GolfCoursesService>(GolfCoursesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
