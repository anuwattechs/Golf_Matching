import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { AnonymousStrategy } from './strategies/anonymous.strategy';
import { ConfigModule } from '@nestjs/config';
import { UtilsModule } from 'src/shared/utils/utils.module';
import { ModelsModule } from 'src/schemas/models/models.module';

@Module({
  imports: [
    UtilsModule,
    ConfigModule,
    ModelsModule,
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy, AnonymousStrategy],
  exports: [AuthService],
})
export class AuthModule {}
