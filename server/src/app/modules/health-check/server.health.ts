// server.health.ts
import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import * as os from 'os';

@Injectable()
export class ServerHealthIndicator extends HealthIndicator {
  checkCPUUsage(): boolean {
    const cpus = os.cpus();
    let idleTime = 0;
    let totalTime = 0;

    cpus.forEach((cpu) => {
      for (const type in cpu.times) {
        totalTime += cpu.times[type];
      }
      idleTime += cpu.times.idle;
    });

    const usage = (1 - idleTime / totalTime) * 100;
    return usage < 80; // Returns true if CPU usage is below 80%
  }

  checkMemoryUsage(): boolean {
    const freeMemory = os.freemem();
    const totalMemory = os.totalmem();
    const usage = (1 - freeMemory / totalMemory) * 100;
    return usage < 80; // Returns true if memory usage is below 80%
  }

  checkDiskSpace(): boolean {
    // Here, you would add logic to check disk space usage
    // Example using a package like `diskusage`, but we'll mock it for simplicity
    const usage = 60; // Assume 60% disk usage
    return usage < 80; // Returns true if disk usage is below 80%
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    const isCPUHealthy = this.checkCPUUsage();
    const isMemoryHealthy = this.checkMemoryUsage();
    const isDiskHealthy = this.checkDiskSpace();

    const isHealthy = isCPUHealthy && isMemoryHealthy && isDiskHealthy;

    if (isHealthy) {
      return this.getStatus('server', true);
    }

    throw new HealthCheckError('Server health check failed', {
      cpu: isCPUHealthy ? 'up' : 'down',
      memory: isMemoryHealthy ? 'up' : 'down',
      disk: isDiskHealthy ? 'up' : 'down',
    });
  }
}
