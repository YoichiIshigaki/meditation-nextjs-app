/**
 * 配列の隣接する要素のペアを作成する
 */
export const createAdjacentPairs = <T>(array: T[]): Array<[T, T]> => {
  return array.slice(0, -1).map((item, index) => [item, array[index + 1]]);
};

/**
 * 配列をチャンクに分割する
 * @param array 分割する配列
 * @param size 各チャンクのサイズ
 * @returns チャンクに分割された2次元配列
 */
export const chunk = <T>(array: T[], size: number): T[][] => {
  if (size <= 0) {
    return [];
  }
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
};
