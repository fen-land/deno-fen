/**
 * tool/logger.ts
 * An ugly logger for fen
 * @author DominicMing
 */

// map for level to number
const levelMap = {
  "ALL": 0,
  "TRACE": 1,
  "DEBUG": 2,
  "INFO": 3,
  "WARN": 4,
  "ERROR": 5,
  "FATAL": 6,
  "OFF": 7,
} as { [key: string]: number };

// default level are given here
const DEFAULT_LEVEL = "INFO";

/**
 * Logger class
 * @param option {{
 *   level: number
 * }}
 */
export class Logger {
  // this printer means what pip u r using
  private static printer = console;

  // logger level
  level = levelMap[DEFAULT_LEVEL];

  constructor(opt = { level: DEFAULT_LEVEL }) {
    let { level } = opt;

    if (typeof level === "string") {
      level = level.toUpperCase();
    }

    if (levelMap[level] > -1) {
      this.level = levelMap[level];
    }
  }

  /**
   * print info
   * @param type {string}
   * @param info {}
   */
  private print(type: string, info: Array<any>) {
    if (levelMap[type] >= this.level) {
      Logger.printer.log.apply(Logger.printer, [`[Fen][${type}]\t`, ...info]);
    }
  }

  /**
   * change log level
   * @param level {string}
   */
  changeLevel(level: string = DEFAULT_LEVEL) {
    this.level = levelMap[level] || 0;
  }

  trace(...info: any[]) {
    this.print("TRACE", info);
  }

  debug(...info: any[]) {
    this.print("DEBUG", info);
  }

  info(...info: any[]) {
    this.print("INFO", info);
  }

  warn(...info: any[]) {
    this.print("WARN", info);
  }

  error(...info: any[]) {
    this.print("ERROR", info);
  }

  fatal(...info: any[]) {
    this.print("FATAL", info);
  }
}
