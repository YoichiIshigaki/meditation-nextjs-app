/**
 * 配列の隣接する要素のペアを作成する
 */
export const createAdjacentPairs = <T>(array: T[]): Array<[T, T]> => {
  return array.slice(0, -1).map((item, index) => [item, array[index + 1]]);
};