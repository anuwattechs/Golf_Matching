import { Controller, Get, Param, Patch, Query, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtPayloadType } from '../auth/strategies/types';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getNotifications(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Req() req: Request & { decoded: JwtPayloadType },
  ) {
    return this.notificationsService.getNotifications(req.decoded, page, limit);
  }

  @Patch(':notificationId/mark-read')
  async markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }
}
