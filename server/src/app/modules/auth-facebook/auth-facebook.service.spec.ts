import { Test, TestingModule } from '@nestjs/testing';
import { AuthFacebookService } from './auth-facebook.service';

describe('AuthFacebookService', () => {
  let service: AuthFacebookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthFacebookService],
    }).compile();

    service = module.get<AuthFacebookService>(AuthFacebookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
