import { Module } from '@nestjs/common';
import { GolfCourseLayoutService } from './golf-course-layout.service';
import { GolfCourseLayoutController } from './golf-course-layout.controller';
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
  controllers: [GolfCourseLayoutController],
  providers: [GolfCourseLayoutService, JwtStrategy],
})
export class GolfCourseLayoutModule {}
