type LogLevel = "debug" | "info" | "warn" | "error";

type LogContext = {
  userId?: number;
  endpoint?: string;
  status?: number;
};

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const MIN_LEVEL: LogLevel =
  process.env.NODE_ENV === "production" ? "warn" : "debug";

const shouldLog = (level: LogLevel): boolean =>
  LOG_LEVELS[level] >= LOG_LEVELS[MIN_LEVEL];

const format = (
  level: LogLevel,
  message: string,
  context?: LogContext,
): string => {
  const timestamp = new Date().toISOString();
  const base = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  if (!context || Object.keys(context).length === 0) return base;
  return `${base} ${JSON.stringify(context)}`;
};

export const logger = {
  /**
   * debugレベルのログを出力する。
   * productionでは出力されない。
   * @param message - ログメッセージ
   * @param context - 追加コンテキスト（userId, endpoint, statusなど）
   * @returns void
   */
  debug: (message: string, context?: LogContext) => {
    if (shouldLog("debug")) console.debug(format("debug", message, context));
  },

  /**
   * infoレベルのログを出力する。
   * productionでは出力されない。
   * @param message - ログメッセージ
   * @param context - 追加コンテキスト（userId, endpoint, statusなど）
   * @returns void
   */
  info: (message: string, context?: LogContext) => {
    if (shouldLog("info")) console.info(format("info", message, context));
  },

  /**
   * warnレベルのログを出力する。
   * @param message - ログメッセージ
   * @param context - 追加コンテキスト（userId, endpoint, statusなど）
   * @returns void
   */
  warn: (message: string, context?: LogContext) => {
    if (shouldLog("warn")) console.warn(format("warn", message, context));
  },

  /**
   * errorレベルのログを出力する。
   * @param message - ログメッセージ
   * @param context - 追加コンテキスト（userId, endpoint, statusなど）
   * @returns void
   */
  error: (message: string, context?: LogContext) => {
    if (shouldLog("error")) console.error(format("error", message, context));
  },
};
