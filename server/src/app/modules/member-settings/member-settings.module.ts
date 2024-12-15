import { Module } from '@nestjs/common';
import { MemberSettingsService } from './member-settings.service';
import { MemberSettingsController } from './member-settings.controller';
import { PassportModule } from '@nestjs/passport';
import { ModelsModule } from 'src/schemas/models/models.module';
import { UtilsModule } from 'src/shared/utils/utils.module';
import { AuthModule } from '../auth/auth.module';
import { MembersModule } from '../members/members.module';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';

@Module({
  imports: [
    ModelsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    UtilsModule,
    MembersModule,
  ],
  controllers: [MemberSettingsController],
  providers: [MemberSettingsService, JwtStrategy],
})
export class MemberSettingsModule {}
