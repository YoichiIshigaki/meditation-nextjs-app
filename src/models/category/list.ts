import { categoryCollection, toCategory, type Category, type CategoryDoc } from "./";
import { main } from "@/models/common/util";

export type ListOptions = {
  limitCount?: number;
  orderByField?: keyof Category;
  orderDirection?: "asc" | "desc";
};

export const list = async (options?: ListOptions): Promise<Category[]> => {
  let collectionRef: FirebaseFirestore.Query = await categoryCollection();

  // Sort
  const orderField = options?.orderByField || "order";
  const orderDir = options?.orderDirection || "asc";
  collectionRef = collectionRef.orderBy(orderField, orderDir);

  // Limit
  if (options?.limitCount) {
    collectionRef = collectionRef.limit(options.limitCount);
  }

  const querySnapshot = await collectionRef.get();

  const categories: Category[] = [];
  querySnapshot.forEach((docSnap) => {
    if (docSnap.exists) {
      categories.push(toCategory(docSnap.id, docSnap.data() as CategoryDoc));
    }
  });

  return categories;
};

/*
 * list test data category
 *
 * npm run exec-trial-ts-file src/models/category/list.ts
 */
main(list, {
  limitCount: 10,
});
