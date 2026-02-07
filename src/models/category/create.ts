import { FieldValue } from "firebase-admin/firestore";
import { categoryCollection, type Category } from "./";
import { main } from "@/models/common/util";

type CategoryCreateParam = Omit<Category, "id" | "created_at" | "updated_at">;

export const create = async (param: CategoryCreateParam): Promise<string> => {
  const collectionRef = await categoryCollection();

  const docData = {
    ...param,
    created_at: FieldValue.serverTimestamp(),
    updated_at: FieldValue.serverTimestamp(),
  };

  const docRef = await collectionRef.add(docData);

  return docRef.id;
};

/*
 * create test data category
 *
 * npm run exec-trial-ts-file src/models/category/create.ts
 */
main(create, {
  name: "睡眠",
  slug: "sleep",
  description: "睡眠の質を向上させる瞑想コンテンツ",
  order: 1,
});
