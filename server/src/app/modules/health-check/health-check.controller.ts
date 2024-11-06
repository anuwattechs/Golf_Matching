import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { MongooseHealthIndicator } from '@nestjs/terminus';
import { InfobipHealthIndicator } from './infobip.health';

@Controller('healthcheck')
export class HealthCheckController {
  constructor(
    private health: HealthCheckService,
    private mongooseHealthIndicator: MongooseHealthIndicator,
    private infobipHealthIndicator: InfobipHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      async () => this.mongooseHealthIndicator.pingCheck('mongodb'),
      async () => this.infobipHealthIndicator.isHealthy(),
    ]);
  }
}
