import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { UtilsModule } from 'src/shared/utils/utils.module';
import { ModelsModule } from 'src/schemas/models/models.module';
import { AnonymousStrategy } from './strategy/anonymous.strategy';
import { SmsModule } from '../sms/sms.module';

@Module({
  imports: [
    ConfigModule,
    UtilsModule,
    ModelsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: '' + process.env.AUTH_JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    SmsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AnonymousStrategy],
  exports: [AuthService],
})
export class AuthModule {}
