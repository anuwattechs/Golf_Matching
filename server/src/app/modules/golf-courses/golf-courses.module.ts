import { Module } from '@nestjs/common';
import { GolfCoursesService } from './golf-courses.service';
import { GolfCoursesController } from './golf-courses.controller';
import { ModelsModule } from 'src/schemas/models/models.module'; // Ensure ModelsModule is imported
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [ModelsModule, AuthModule, PassportModule],
  controllers: [GolfCoursesController],
  providers: [GolfCoursesService, JwtStrategy],
  exports: [GolfCoursesService],
})
export class GolfCoursesModule {}
