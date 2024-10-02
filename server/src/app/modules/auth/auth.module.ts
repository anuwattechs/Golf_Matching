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

// console.log(
//   'AuthModule',
//   new ConfigService<AllConfigType>().get<string>('auth.jwtSecret', {
//     infer: true,
//   }),
// );cls

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
      // signOptions: {
      //   expiresIn: new ConfigService<AllConfigType>().get<string>(
      //     'auth.jwtExpiresIn',
      //     {
      //       infer: true,
      //     },
      //   ),
      // },
      secret: '' + process.env.AUTH_JWT_SECRET,
      // signOptions: { expiresIn: '' + process.env.AUTH_JWT_TOKEN_EXPIRES_IN },
      // secret:
      //   'MIICWgIBAAKBgHmClSmjoOySXit4sxiQnKZypkInTi5B9qsPb1aOLVdmatgdj0AEtr5pGtQ0RpNWP4twDVDrFXIRXkTTZLB/S6sVHMjROSnauSHIIaK1Trib3U5LeYaAE2gR6ESqfXinAqfTwr1BFKK2WhhSzpV0GOxb8ZdB695P2oU3EyiEF2/lAgMBAAECgYBz3j+a6zujG5fM4FX4EL4wQpej8ZMtrR0o1ZkX8o/uDe3Ik7dsFpKkU9mPjSHXkaEauAkapnFWypUYEHStkVV3Q4gb0z6CretmFM/n79HcYXZLjKdDRDe+zgCPaTK0fmQ9ahSA53ZMQLJ4HEb2JeTVLI+H6sMm3F8VB1WzxLncAQJBANDPv2iuv9TZwuztWPXUcuJNmIVxQ3VjCte8DGfH+A4eUO2x3JQCUpARCciGROt8UHcpCZWFMUmKRhoCCZqy/WUCQQCU+Dxg2r6nFOkPPJetykx2S7r422Pr6aTZgB3GOBi7l/V6GgqVEeeUuJ9zfFp55tTLid5ScJ2CbRy38LjR0sCBAkAB7XkJ4VsZ/uyivUot8skgt7CpwrLpuYFXHoBK0PjEQJlkqFit8RuMAuxBMqQePGaNww44mCMtV55wDQbDq9VVAkBrXjsOR7qv69dKXw6neK4BePWqlV2AVCa3iKptClNxKcYImipUZNI3k5WBA/il8aQfix/M5VPxBDl1ra9Xs4GBAkBgx44DtU7uqO/y/9AfAnd8br4cJPfZ9RJ951I5Fo7tVHPDld7QizF1/vkfiZnwOdLAHDpE3faeExkLSM222Y2C',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
