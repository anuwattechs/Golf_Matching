import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';
import { ModelsModule } from 'src/schemas/models/models.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { AuthModule } from '../auth/auth.module';
import { UtilsModule } from 'src/shared/utils/utils.module';
import { MembersModule } from '../members/members.module';
import { ScoresModule } from '../scores/scores.module';

@Module({
  imports: [
    ModelsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    UtilsModule,
    MembersModule,
    ScoresModule,
  ],
  controllers: [MatchController],
  providers: [MatchService, JwtStrategy],
  exports: [MatchService],
})
export class MatchModule {}
