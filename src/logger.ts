type LogLevel = "error" | "warn" | "info" | "debug";

const levelPriority: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const currentLevel = (process.env.LOG_LEVEL as LogLevel | undefined) ?? "info";

function shouldLog(level: LogLevel): boolean {
  return levelPriority[level] <= levelPriority[currentLevel];
}

function formatMessage(level: LogLevel, message: string, meta?: unknown) {
  const timestamp = new Date().toISOString();
  const base = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

  if (meta === undefined) return base;

  if (meta instanceof Error) {
    return `${base}\n${meta.stack ?? meta.message}`;
  }

  try {
    return `${base} ${JSON.stringify(meta)}`;
  } catch {
    return `${base} ${String(meta)}`;
  }
}

export const logger = {
  error(message: string, meta?: unknown) {
    if (!shouldLog("error")) return;
    console.error(formatMessage("error", message, meta));
  },

  warn(message: string, meta?: unknown) {
    if (!shouldLog("warn")) return;
    console.warn(formatMessage("warn", message, meta));
  },

  info(message: string, meta?: unknown) {
    if (!shouldLog("info")) return;
    console.log(formatMessage("info", message, meta));
  },

  debug(message: string, meta?: unknown) {
    if (!shouldLog("debug")) return;
    console.log(formatMessage("debug", message, meta));
  },
};