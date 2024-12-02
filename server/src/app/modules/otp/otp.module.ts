import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { ModelsModule } from 'src/schemas/models/models.module';
import { SmsModule } from 'src/app/common/services/sms/sms.module';
import { UtilsModule } from 'src/shared/utils/utils.module';
import { MailModule } from 'src/app/common/services/mail/mail.module';
import { AuthModule } from '../auth/auth.module';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';

@Module({
  imports: [
    ModelsModule,
    UtilsModule,
    SmsModule,
    UtilsModule,
    MailModule,
    AuthModule,
  ],
  controllers: [OtpController],
  providers: [OtpService, JwtStrategy],
})
export class OtpModule {}
