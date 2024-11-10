import { Module } from '@nestjs/common';
import { HoleScoresService } from './hole-scores.service';
import { HoleScoresController } from './hole-scores.controller';
import { PassportModule } from '@nestjs/passport';
import { ModelsModule } from 'src/schemas/models/models.module';
import { UtilsModule } from 'src/shared/utils/utils.module';
import { AuthModule } from '../auth/auth.module';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { MembersModule } from '../members/members.module';

@Module({
  imports: [
    ModelsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    UtilsModule,
    MembersModule,
  ],
  controllers: [HoleScoresController],
  providers: [HoleScoresService, JwtStrategy],
})
export class HoleScoresModule {}
