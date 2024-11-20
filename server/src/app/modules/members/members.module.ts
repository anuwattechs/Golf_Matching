import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ModelsModule } from 'src/schemas/models/models.module';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UtilsModule } from 'src/shared/utils/utils.module';
import { AWSModule } from 'src/app/common/services/aws/aws.module';

@Module({
  imports: [
    ConfigModule,
    ModelsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    UtilsModule,
    AWSModule,
  ],
  controllers: [MembersController],
  providers: [MembersService, JwtStrategy],
})
export class MembersModule {}
