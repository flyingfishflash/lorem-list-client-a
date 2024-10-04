import { InjectionToken, inject } from '@angular/core';
import { LogLevel } from '../../model/loglevel.enum';

export const MIN_LOG_LEVEL = new InjectionToken<LogLevel>('Minimum log level');

export class Logger {
  #scope: string;
  readonly #minLogLevel = inject(MIN_LOG_LEVEL) ?? LogLevel.NEVER;

  constructor(scope: string) {
    this.#scope = scope;
  }

  trace(message: string, ...optionalParams: any[]): void {
    this.#log(LogLevel.TRACE, message, ...optionalParams);
  }

  debug(message: string, ...optionalParams: any[]): void {
    this.#log(LogLevel.DEBUG, message, ...optionalParams);
  }

  info(message: string, ...optionalParams: any[]): void {
    this.#log(LogLevel.INFO, message, ...optionalParams);
  }

  warn(message: string, ...optionalParams: any[]): void {
    this.#log(LogLevel.WARN, message, ...optionalParams);
  }

  error(message: string, ...optionalParams: any[]): void {
    this.#log(LogLevel.ERROR, message, ...optionalParams);
  }

  #log(logLevel: LogLevel, message: string, ...optionalParams: any[]): void {
    if (!this.#canLog(logLevel)) return;

    const msg = this.#buildLogEntry(logLevel, message);
    const consoleMethod = this.#getConsoleMethod(logLevel);

    consoleMethod(msg.concat('\n'), ...optionalParams);
  }

  #canLog(logLevel: LogLevel): boolean {
    return logLevel >= this.#minLogLevel;
  }

  #buildLogEntry(logLevel: LogLevel, message: string): string {
    const logLevelPadded = LogLevel[logLevel].padEnd(5);
    return `${new Date().toISOString()} | ${logLevelPadded} | ${this.#scope} | ${message}`;
  }

  #getConsoleMethod(logLevel: LogLevel): (...data: any[]) => void {
    switch (logLevel) {
      case LogLevel.TRACE:
        return console.trace.bind(console);
      case LogLevel.DEBUG:
        return console.debug.bind(console);
      case LogLevel.INFO:
        return console.info.bind(console);
      case LogLevel.WARN:
        return console.warn.bind(console);
      case LogLevel.ERROR:
        return console.error.bind(console);
      default:
        return () => {};
    }
  }
}
