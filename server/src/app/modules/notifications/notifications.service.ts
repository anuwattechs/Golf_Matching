import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateNotificationsDto } from 'src/schemas/models/dto';
import { NotificationsModel } from 'src/schemas/models/notifications.model';
import { JwtPayloadType } from '../auth/strategies/types';
import { UtilsService } from 'src/shared/utils/utils.service';
import { FcmService } from 'src/app/common/services/fcm/fcm.service';
import { FcmMessage } from 'src/app/common/services/fcm/interface';
import { NotificationType } from 'src/shared/enums';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly notificationModel: NotificationsModel,
    private readonly utilsService: UtilsService,
    private readonly fcmService: FcmService,
  ) {}

  /**
   * Get notifications with pagination and filter by user.
   */
  async getNotifications(decoded: JwtPayloadType, page: number, limit: number) {
    try {
      const {
        data: results,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
        limit: _limit,
        page: _page,
      } = await this.utilsService.findAllWithPaginationAndFilter(
        this.notificationModel.rootNotifications(),
        page,
        limit,
        {
          memberId: decoded.userId,
        },
      );

      return {
        data: results,
        total,
        page: _page,
        limit: _limit,
        totalPages,
        hasNextPage,
        hasPrevPage,
      };
    } catch (error) {
      this.throwHttpException(
        'Error getting notifications',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Mark notification as read by its ID.
   */
  async markAsRead(id: string) {
    try {
      const result = await this.notificationModel.markNotificationAsRead(id);
      if (!result) {
        throw new NotFoundException(`Notification with id ${id} not found`);
      }
      return result;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error marking notification as read',
      );
    }
  }

  /**
   * Create a new notification.
   */
  async createNotification(input: CreateNotificationsDto) {
    try {
      const newNotification =
        await this.notificationModel.addNotification(input);
      if (!newNotification) {
        this.throwHttpException(
          'Error creating notification',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return newNotification;
    } catch (error) {
      this.throwHttpException(
        'Error creating notification',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Create a notification and send it via FCM (Firebase Cloud Messaging).
   */
  async createNotificationAndSend(
    input: CreateNotificationsDto,
    fcmToken: string,
    type: NotificationType,
    sender: string,
    receiver: string,
  ): Promise<any> {
    try {
      const newNotification =
        await this.notificationModel.addNotification(input);
      if (!newNotification) {
        throw new InternalServerErrorException('Error creating notification');
      }

      await this.sendPushNotification(
        fcmToken,
        input.message,
        input.metadata,
        type,
        sender,
        receiver,
      );
      return newNotification;
    } catch (error) {
      this.throwHttpException(
        'Error creating and sending notification',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Send a push notification via FCM (Firebase Cloud Messaging).
   */
  private async sendPushNotification(
    fcmToken: string,
    message: string,
    metadata: Record<string, any>,
    type: NotificationType,
    sender: string,
    receiver: string,
  ): Promise<string> {
    try {
      const fcmMessage: FcmMessage = {
        token: fcmToken,
        title: this.utilsService.generateMessageNotification(
          type,
          sender,
          receiver,
        ),
        body: message,
        data: metadata,
      };

      const result = await this.fcmService.sendToDevice(fcmMessage);
      if (!result) {
        this.throwHttpException(
          'Error sending push notification',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return result;
    } catch (error) {
      this.throwHttpException(
        'Error sending push notification',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private throwHttpException(message: string, statusCode: HttpStatus) {
    throw new HttpException({ status: false, statusCode, message }, statusCode);
  }
}
