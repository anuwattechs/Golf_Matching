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
// import { SmsModule } from 'src/app/common/services/sms/sms.module';

@Module({
  imports: [
    UtilsModule,
    ConfigModule,
    ModelsModule,
    PassportModule,
    // PassportModule.register({ defaultStrategy: 'jwt' }),
    // JwtModule.register({
    //   secret: '' + process.env.AUTH_JWT_SECRET,
    //   signOptions: { expiresIn: '1h' },
    // }),
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy, AnonymousStrategy],
  exports: [AuthService],
})
export class AuthModule {}
