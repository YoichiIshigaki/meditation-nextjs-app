import { categoryCollection, toCategory, type Category, type CategoryDoc } from "./";
import { main } from "@/models/common/util";

export const get = async (id: string): Promise<Category> => {
  const collectionRef = await categoryCollection();
  const categoryDocSnap = await collectionRef.doc(id).get();

  if (categoryDocSnap.exists) {
    return toCategory(categoryDocSnap.id, categoryDocSnap.data() as CategoryDoc);
  }
  console.error(`Category with id ${id} not found.`);
  throw new Error(`Category with id ${id} not found.`);
};

export const getNotThrow = async (id: string): Promise<Category | null> => {
  const collectionRef = await categoryCollection();
  const categoryDocSnap = await collectionRef.doc(id).get();

  if (categoryDocSnap.exists) {
    return toCategory(categoryDocSnap.id, categoryDocSnap.data() as CategoryDoc);
  }
  console.error(`Category with id ${id} not found.`);
  return null;
};

/*
 * get test data category
 *
 * npm run exec-trial-ts-file src/models/category/get.ts
 */
main(get, "test_category_id");
