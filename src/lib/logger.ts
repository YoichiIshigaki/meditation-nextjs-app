const env = process.env.NODE_ENV || "development";
const logDir = process.env.LOG_DIR || "app-logs";

// ログレベルの定義
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// 環境に応じたログレベルを設定
const level = () => {
  return env === "development" ? "debug" : "info";
};

type LoggerType = {
  info: (...messages: unknown[]) => void;
  error: (...messages: unknown[]) => void;
  warn: (...messages: unknown[]) => void;
  http: (...messages: unknown[]) => void;
  debug: (...messages: unknown[]) => void;
};

let loggerImplementation: LoggerType;

// Edge runtime (Middleware etc.) 
// cloud flare worker等でデプロイした時に使用される。
if (process.env.NEXT_RUNTIME === "edge") {
  const now = new Date().toISOString()
  loggerImplementation = {
    debug: (...messages) => console.log(`[${now}] [debug]: `, ...messages),
    info: (...messages) => console.log(`[${now}] [info]: `, ...messages),
    warn: (...messages) => console.warn(`[${now}] [warn]: `, ...messages),
    error: (...messages) => console.error(`[${now}] [error]: `, ...messages),
    http: (...messages) => console.log(`[${now}] [http]: `, ...messages),
  };
} else {
  // Node.js runtime
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const winston = require("winston");
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const path = require("path");

  // ログのフォーマットを定義
  const format = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(
      (info: { timestamp: string, level: string, message: string }) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
  );

  // ログの出力先を定義
  const transports: unknown[] = [
    // エラーログファイル
    new winston.transports.File({
      filename: path.join(logDir, "app-error.log"),
      level: "error",
      format: winston.format.json(),
    }),
    // 全てのログファイル
    new winston.transports.File({
      filename: path.join(logDir, "app-all.log"),
      format: winston.format.json(),
    }),
  ];

  // 開発環境用のコンソール出力
  if (env === "development") {
    transports.push(new winston.transports.Console());
  }

  loggerImplementation = winston.createLogger({
    level: level(),
    levels,
    format,
    transports,
  });
}

// ロガーを作成
export const logger = loggerImplementation;