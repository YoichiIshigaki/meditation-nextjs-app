import { categoryCollection, type CategoryDoc } from "./";
import { main, getUpdateParam } from "@/models/common/util";

export type CategoryUpdateParam = Partial<
  Omit<CategoryDoc, "id" | "created_at" | "updated_at">
>;

export const update = async (
  id: string,
  param: CategoryUpdateParam,
): Promise<void> => {
  const collectionRef = await categoryCollection();

  const updateData = getUpdateParam<CategoryUpdateParam>(param);

  await collectionRef.doc(id).update(updateData);
};

/*
 * update test data category
 *
 * npm run exec-trial-ts-file src/models/category/update.ts
 */
main(update, "test_category_id", {
  name: "ストレス軽減",
  slug: "stress",
  description: "ストレスを軽減する瞑想コンテンツ",
  order: 2,
});
