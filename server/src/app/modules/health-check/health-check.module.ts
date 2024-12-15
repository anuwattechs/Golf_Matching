import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthCheckController } from './health-check.controller';
import { MongooseHealthIndicator } from '@nestjs/terminus';
import { S3HealthIndicator } from './s3.health';
import { InfobipHealthIndicator } from './infobip.health';
import { UtilsModule } from 'src/shared/utils/utils.module';
import { ServerHealthIndicator } from './server.health';

@Module({
  imports: [TerminusModule, HttpModule, UtilsModule],
  controllers: [HealthCheckController],
  providers: [
    MongooseHealthIndicator,
    S3HealthIndicator,
    InfobipHealthIndicator,
    ServerHealthIndicator,
  ],
})
export class HealthCheckModule {}
