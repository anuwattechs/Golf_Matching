import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FcmMessage, FcmTopicMessage } from './interface';
import { initializeFirebaseApp } from './config/fcm.config';

@Injectable()
export class FcmService {
  private readonly logger = new Logger(FcmService.name);

  constructor() {
    initializeFirebaseApp();
    this.logger.log('Firebase Admin initialized successfully.');
  }

  async sendToDevice(message: FcmMessage): Promise<string> {
    try {
      const response = await admin.messaging().send({
        notification: {
          title: message.title,
          body: message.body,
        },
        data: message.data,
        token: message.token,
      });
      this.logger.log(`Notification sent to device: ${response}`);
      return response;
    } catch (error) {
      this.logger.error('Error sending notification to device', error);
      throw error;
    }
  }

  async sendToTopic(message: FcmTopicMessage): Promise<string> {
    try {
      const response = await admin.messaging().send({
        notification: {
          title: message.title,
          body: message.body,
        },
        data: message.data,
        topic: message.topic,
      });
      this.logger.log(`Notification sent to topic: ${response}`);
      return response;
    } catch (error) {
      this.logger.error('Error sending notification to topic', error);
      throw error;
    }
  }
}
