import { Test, TestingModule } from '@nestjs/testing';
import { AuthAppleService } from './auth-apple.service';

describe('AuthAppleService', () => {
  let service: AuthAppleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthAppleService],
    }).compile();

    service = module.get<AuthAppleService>(AuthAppleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
