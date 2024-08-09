import { InjectionToken, inject } from '@angular/core';
import { LogLevel } from './loglevel.enum';

export const MIN_LOG_LEVEL = new InjectionToken<LogLevel>('Minimum log level');

export class Logger {
  #scope: string = 'default';

  readonly #minLogLevel = inject(MIN_LOG_LEVEL) ?? LogLevel.NEVER;

  constructor(scope: string) {
    this.#scope = scope;
  }

  trace(message: string, ...optionalParams: any[]): void {
    if (!this.#canLog(LogLevel.TRACE)) return;
    console.trace(this.#buildLogEntry(LogLevel.TRACE, message, optionalParams));
  }

  debug(message: string, ...optionalParams: any[]): void {
    if (!this.#canLog(LogLevel.DEBUG)) return;
    console.debug(this.#buildLogEntry(LogLevel.DEBUG, message, optionalParams));
  }

  info(message: string, ...optionalParams: any[]): void {
    if (!this.#canLog(LogLevel.INFO)) return;
    console.info(this.#buildLogEntry(LogLevel.INFO, message, optionalParams));
  }

  warn(message: string, ...optionalParams: any[]): void {
    if (!this.#canLog(LogLevel.WARN)) return;
    console.warn(this.#buildLogEntry(LogLevel.WARN, message, optionalParams));
  }

  error(message: string, ...optionalParams: any[]): void {
    if (!this.#canLog(LogLevel.ERROR)) return;
    console.warn(this.#buildLogEntry(LogLevel.ERROR, message, optionalParams));
  }

  #canLog(logLevel: LogLevel): boolean {
    return logLevel >= this.#minLogLevel;
  }

  #buildLogEntry(
    logLevel: LogLevel,
    message: string,
    ...optionalParams: any[]
  ) {
    var logEntry: string = `${new Date().toISOString()} | ${LogLevel[logLevel]} | ${this.#scope} | ${message}`;
    if (optionalParams.length > 1) {
      logEntry = `${new Date().toISOString()} | INFO | ${this.#scope} | ${message} | ${optionalParams}`;
    }
    return logEntry;
  }
}
