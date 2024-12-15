import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { AuthModule } from '../auth/auth.module';
import { ModelsModule } from 'src/schemas/models/models.module';
import { AWSModule } from 'src/app/common/services/aws/aws.module';

@Module({
  imports: [AuthModule, ModelsModule, AWSModule],
  controllers: [PostsController],
  providers: [PostsService, JwtStrategy],
})
export class PostsModule {}
