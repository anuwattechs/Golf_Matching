import { Module } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { ScoresController } from './scores.controller';
import { PassportModule } from '@nestjs/passport';
import { ModelsModule } from 'src/schemas/models/models.module';
import { UtilsModule } from 'src/shared/utils/utils.module';
import { AuthModule } from '../auth/auth.module';
import { MembersModule } from '../members/members.module';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';

@Module({
  imports: [
    ModelsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    UtilsModule,
    MembersModule,
  ],
  controllers: [ScoresController],
  providers: [ScoresService, JwtStrategy],
})
export class ScoresModule {}
