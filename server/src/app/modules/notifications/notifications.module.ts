import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { ModelsModule } from 'src/schemas/models/models.module';
import { UtilsModule } from 'src/shared/utils/utils.module';
import { FcmModule } from 'src/app/common/services/fcm/fcm.module';

@Module({
  imports: [ModelsModule, UtilsModule, FcmModule],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
