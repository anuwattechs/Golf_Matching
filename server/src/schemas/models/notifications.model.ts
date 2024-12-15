import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notifications } from '..';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateNotificationsDto } from './dto/notification.dto';

@Injectable()
export class NotificationsModel {
  constructor(
    @InjectModel(Notifications.name)
    private readonly notificationsModel: Model<Notifications>,
  ) {}

  rootNotifications() {
    return this.notificationsModel;
  }

  /**
   * Add a new notification.
   * @param notificationData - Data for the new notification.
   */
  async addNotification(
    notificationData: CreateNotificationsDto,
  ): Promise<Notifications> {
    try {
      const newNotification =
        await this.notificationsModel.create(notificationData);
      return newNotification.toObject();
    } catch (error) {
      throw new HttpException(
        'Failed to add notification',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Find notifications by member ID.
   * @param memberId - ID of the member.
   */
  async findNotificationsByMemberId(
    memberId: string,
  ): Promise<Notifications[]> {
    return this.notificationsModel.find({ memberId }).lean();
  }

  /**
   * Get a notification by ID.
   * @param notificationId - ID of the notification.
   */
  async getNotificationById(notificationId: string): Promise<Notifications> {
    const notification = await this.notificationsModel
      .findById(notificationId)
      .lean();
    if (!notification) {
      throw new HttpException('Notification not found', HttpStatus.NOT_FOUND);
    }
    return notification;
  }

  /**
   * Mark a notification as read.
   * @param notificationId - ID of the notification.
   */
  async markNotificationAsRead(notificationId: string): Promise<Notifications> {
    const notification = await this.notificationsModel.findById(notificationId);
    if (!notification) {
      throw new HttpException('Notification not found', HttpStatus.NOT_FOUND);
    }
    notification.isRead = true;
    await notification.save();
    return notification.toObject();
  }
}
