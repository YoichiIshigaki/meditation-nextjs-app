import { categoryCollection } from "./";
import { main } from "@/models/common/util";

export const remove = async (id: string): Promise<void> => {
  const collectionRef = await categoryCollection();
  await collectionRef.doc(id).delete();
};

/*
 * delete test data category
 *
 * npm run exec-trial-ts-file src/models/category/delete.ts
 */
main(remove, "test_category_id");
