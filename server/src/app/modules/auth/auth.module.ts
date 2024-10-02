import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { AllConfigType } from 'src/app/config/config.type';
import { ConfigModule } from '@nestjs/config';
import { UtilsModule } from 'src/shared/utils/utils.module';
import { ModelsModule } from 'src/schemas/models/models.module';

@Module({
  imports: [
    ConfigModule,
    UtilsModule,
    ModelsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      // secret: new ConfigService<AllConfigType>().get<string>('auth.jwtSecret', {
      //   infer: true,
      // }),
      // signOptions: { expiresIn: '1h' },
      
      // secret: new ConfigService<AllConfigType>().get<string>('auth.jwtSecret', {
      //   infer: true,
      // }),
      // signOptions: { expiresIn: new ConfigService<AllConfigType>().get<string>('auth.jwtExpiresIn', {
      //   infer: true,
      // }) },

      // secret: new ConfigService<AllConfigType>().get<string>('auth.jwtSecret', {
      //   infer: true,
      // }),
      // signOptions: { expiresIn: new ConfigService<AllConfigType>().get<string>('auth.jwtExpiresIn', {
      //   infer: true,
      // }) },

      secret: process.env.AUTH_JWT_SECRET,
      signOptions: { expiresIn: process.env.AUTH_JWT_TOKEN_EXPIRES_IN },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService]
})
export class AuthModule {}
