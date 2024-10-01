import { Test, TestingModule } from '@nestjs/testing';
import { AuthFacebookController } from './auth-facebook.controller';
import { AuthFacebookService } from './auth-facebook.service';

describe('AuthFacebookController', () => {
  let controller: AuthFacebookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthFacebookController],
      providers: [AuthFacebookService],
    }).compile();

    controller = module.get<AuthFacebookController>(AuthFacebookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
