import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { ModelsModule } from 'src/schemas/models/models.module';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from '../auth/auth.module';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { MembersModule } from '../members/members.module';
import { UtilsModule } from 'src/shared/utils/utils.module';
import { FcmModule } from 'src/app/common/services/fcm/fcm.module';
import { NotificationsModule } from '../notifications/notifications.module';
@Module({
  imports: [
    ModelsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    MembersModule,
    UtilsModule,
    NotificationsModule,
  ],
  controllers: [FriendsController],
  providers: [FriendsService, JwtStrategy],
})
export class FriendsModule {}
