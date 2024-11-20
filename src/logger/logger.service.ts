import 'winston-daily-rotate-file';
import { format, transports, LoggerOptions, createLogger } from 'winston';
import { ConsoleLogger } from '@nestjs/common';

const { printf, combine, timestamp, prettyPrint } = format;

const myFormat = combine(
  timestamp(),
  prettyPrint(),
  printf(({ timestamp, level, message, stack }) => {
    return stack
      ? `${timestamp} [${level}]-${message}:\n ${stack}`
      : `${timestamp} [${level}]-${message}`;
  }),
);

const fileRotateTransport = new transports.DailyRotateFile({
  dirname: './logs',
  filename: '%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '10d',
});

const loggerOption: LoggerOptions = {
  level: process.env.LOG_LEVEL || 'info',
  format: myFormat,
  transports: [fileRotateTransport],
  exitOnError: false,
};

export const logger = createLogger(loggerOption);

export class MyLoggerService extends ConsoleLogger {
  private static winstonLogger = logger;

  error(message: any, stack?: string, context?: string) {
    super.error(message, stack, context);
    MyLoggerService.winstonLogger.error({
      message: `[${context || this.context}]: ${message}`,
      stack,
    });
  }

  log(message: any, context?: string) {
    if (context) {
      super.log(message, context);
    } else {
      super.log(message);
    }
    MyLoggerService.winstonLogger.info(
      `[${context || this.context}]: ${message}`,
    );
  }
  /**
   * Write a 'warn' level log.
   */
  warn(message: any, context?: string) {
    if (context) {
      super.warn(message, context);
    } else {
      super.warn(message);
    }
    MyLoggerService.winstonLogger.warn(
      `[${context || this.context}]: ${message}`,
    );
  }
}
