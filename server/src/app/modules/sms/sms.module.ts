import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { ConfigModule } from '@nestjs/config';
import { TwilioModule } from 'nestjs-twilio';

@Module({
  imports: [
    ConfigModule,
    TwilioModule.forRoot({
      accountSid: process.env.TWILIO_ACCOUNT_SID,
      authToken: process.env.TWILIO_AUTH_TOKEN,
    }),
  ],
  providers: [SmsService],
  exports: [SmsService],
})
export class SmsModule {}
