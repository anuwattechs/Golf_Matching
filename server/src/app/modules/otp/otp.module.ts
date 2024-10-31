import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { ModelsModule } from 'src/schemas/models/models.module';
import { SmsModule } from 'src/app/common/services/sms/sms.module';
import { UtilsModule } from 'src/shared/utils/utils.module';
import { MailModule } from 'src/app/common/services/mail/mail.module';

@Module({
  imports: [ModelsModule, UtilsModule, SmsModule, UtilsModule, MailModule],
  controllers: [OtpController],
  providers: [OtpService],
})
export class OtpModule {}
