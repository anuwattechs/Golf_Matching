import { Module } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { AssetsController } from './assets.controller';
import { ConfigModule } from '@nestjs/config';
import { ModelsModule } from 'src/schemas/models/models.module';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { AuthModule } from '../auth/auth.module';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [ConfigModule, ModelsModule, AuthModule, PassportModule],
  controllers: [AssetsController],
  providers: [AssetsService, JwtStrategy],
  exports: [AssetsService],
})
export class AssetsModule {}