import winston from "winston";
import path from "path";

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

// ログのフォーマットを定義
const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// ログの出力先を定義
const transports: winston.transport[] = [
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

// ロガーを作成
export const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

