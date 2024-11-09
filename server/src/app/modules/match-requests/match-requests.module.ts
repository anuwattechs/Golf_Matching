import { Module } from '@nestjs/common';
import { MatchRequestsService } from './match-requests.service';
import { MatchRequestsController } from './match-requests.controller';
import { PassportModule } from '@nestjs/passport';
import { ModelsModule } from 'src/schemas/models/models.module';
import { UtilsModule } from 'src/shared/utils/utils.module';
import { AuthModule } from '../auth/auth.module';
import { MembersModule } from '../members/members.module';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { MatchModule } from '../match/match.module';

@Module({
  imports: [
    ModelsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    UtilsModule,
    MembersModule,
  ],
  controllers: [MatchRequestsController],
  providers: [MatchRequestsService, JwtStrategy],
})
export class MatchRequestsModule {}
``;
