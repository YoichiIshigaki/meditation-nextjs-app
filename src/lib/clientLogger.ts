// デバッグ用のコンソール出力
export const clientDebugLog = (...arg: unknown[]) => {
  if (["development", "local"].includes(process.env.NODE_ENV ?? "")) {
    console.log(...arg);
  }
};
