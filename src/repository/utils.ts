import { chunk } from "@/util/array";

export const getListByChunk = async <T extends { id: string }>(
  Ids: string[],
  getList: (ids: string[]) => Promise<T[]>,
): Promise<T[]> => {
  const IdsChunk = chunk(Ids, 10);
  return await Promise.all(
    IdsChunk.map(async (ids) => getList(ids)),
  ).then((list) => list.flat());
};