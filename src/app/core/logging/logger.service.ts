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
    let logLevelPadded = LogLevel[logLevel].padEnd(5);
    let logEntry: string = `${new Date().toISOString()} | ${logLevelPadded} | ${this.#scope} | ${message}`;
    if (optionalParams.length > 0 && optionalParams[0].length > 0) {
      logEntry = `${logEntry} | ${optionalParams}`;
    }
    return logEntry;
  }
}
