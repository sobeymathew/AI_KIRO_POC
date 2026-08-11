/**
 * Structured logger for the test framework.
 * Provides context-aware logging with timestamps and source information.
 */
export class Logger {
  private readonly source: string;

  constructor(source: string) {
    this.source = source;
  }

  info(message: string, data?: Record<string, unknown>): void {
    this.log('INFO', message, data);
  }

  warn(message: string, data?: Record<string, unknown>): void {
    this.log('WARN', message, data);
  }

  error(message: string, data?: Record<string, unknown>): void {
    this.log('ERROR', message, data);
  }

  debug(message: string, data?: Record<string, unknown>): void {
    if (process.env.DEBUG === 'true') {
      this.log('DEBUG', message, data);
    }
  }

  private log(level: string, message: string, data?: Record<string, unknown>): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      source: this.source,
      message,
      ...(data && { data }),
    };

    const formatted = `[${timestamp}] [${level}] [${this.source}] ${message}`;

    switch (level) {
      case 'ERROR':
        console.error(formatted, data ? JSON.stringify(data) : '');
        break;
      case 'WARN':
        console.warn(formatted, data ? JSON.stringify(data) : '');
        break;
      default:
        console.log(formatted, data ? JSON.stringify(data) : '');
    }

    // Write to log file for reporting
    this.writeToFile(logEntry);
  }

  private writeToFile(entry: Record<string, unknown>): void {
    // In production, this would append to a log file
    // For now, structured logs go to stdout for CI/CD capture
    if (process.env.LOG_TO_FILE === 'true') {
      const fs = require('fs');
      const path = require('path');
      const logPath = path.resolve(__dirname, '../../reporting/artifacts/logs/framework.log');
      fs.appendFileSync(logPath, JSON.stringify(entry) + '\n');
    }
  }
}
