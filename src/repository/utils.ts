import { chunk } from "@/util/array";

export const getListByChunk = async <T extends { id: string }>(
  Ids: string[],
  getList: (ids: string[]) => Promise<T[]>,
): Promise<T[]> =>
  Promise.all(chunk(Ids, 10).map(async (ids) => getList(ids))).then((list) =>
    list.flat(),
  );
