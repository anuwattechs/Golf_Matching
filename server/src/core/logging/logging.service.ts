import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

@Injectable()
export class LoggingService implements LoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info', // Adjust log level as needed (info, warn, error)
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message, context }) => {
          return `${timestamp} [${level.toUpperCase()}] ${context ? `[${context}]` : ''}: ${message}`;
        }),
      ),
      transports: [
        new DailyRotateFile({
          dirname: './logs', // Log directory
          filename: 'error-%DATE%.txt', // Log file format
          datePattern: 'YYYY-MM-DD', // Log rotation daily
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d', // Keep logs for 14 days
          level: 'error', // Only write error logs to file
        }),
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple(),
          ),
        }),
      ],
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { context, trace });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }
}
