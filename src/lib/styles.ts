import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSSのクラス名をマージするユーティリティ関数
 * clsxで条件付きクラスを処理し、tailwind-mergeで重複を解決する
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
