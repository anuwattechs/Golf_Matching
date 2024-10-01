import { Test, TestingModule } from '@nestjs/testing';
import { AuthAppleController } from './auth-apple.controller';
import { AuthAppleService } from './auth-apple.service';

describe('AuthAppleController', () => {
  let controller: AuthAppleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthAppleController],
      providers: [AuthAppleService],
    }).compile();

    controller = module.get<AuthAppleController>(AuthAppleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
