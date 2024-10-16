import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { ModelsModule } from 'src/schemas/models/models.module';
import { SmsModule } from 'src/app/common/services/sms/sms.module';
import { UtilsModule } from 'src/shared/utils/utils.module';

@Module({
  imports: [ModelsModule, UtilsModule, SmsModule, UtilsModule],
  controllers: [OtpController],
  providers: [OtpService],
})
export class OtpModule {}
