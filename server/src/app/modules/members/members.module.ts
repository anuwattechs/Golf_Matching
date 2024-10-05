import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ModelsModule } from 'src/schemas/models/models.module';
import { MembersService } from './members.service';
import { MembersController } from './members.controller';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ModelsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
  ],
  controllers: [MembersController],
  providers: [MembersService, JwtStrategy],
})
export class MembersModule {}
