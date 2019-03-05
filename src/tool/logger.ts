const levelMap = {
  ALL: 0,
  TRACE: 1,
  DEBUG: 2,
  INFO: 3,
  WARN: 4,
  ERROR: 5,
  FATAL: 6,
  OFF: 7
};

const DEFAULT_LEVEL = "INFO";

export class Logger {
  private static printer = console;

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

  private print(type, info) {
    if (levelMap[type] >= this.level) {
      Logger.printer.log.apply(Logger.printer, [`[Fen][${type}]\t`, ...info]);
    }
  }

  changeLevel(level = DEFAULT_LEVEL) {
    this.level = levelMap[level.toUpperCase()];
  }

  trace(...info) {
    this.print("TRACE", info);
  }

  debug(...info) {
    this.print("DEBUG", info);
  }

  info(...info) {
    this.print("INFO", info);
  }

  warn(...info) {
    this.print("WARN", info);
  }

  error(...info) {
    this.print("ERROR", info);
  }

  fatal(...info) {
    this.print("FATAL", info);
  }
}
