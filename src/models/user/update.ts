import { userCollection, type UserDoc } from "./";
import { main, getUpdateParam } from "@/models/common/util";

export type UserUpdateParam = Partial<
  Omit<UserDoc, "id" | "created_at" | "updated_at">
>;

export const update = async (
  id: string,
  param: UserUpdateParam,
): Promise<void> => {
  const collectionRef = await userCollection();

  // Firestoreに保存するデータを作成
  // updated_atのみを更新（created_atは変更しない）
  const updateData = getUpdateParam<UserUpdateParam>(param);

  // ドキュメントを更新
  await collectionRef.doc(id).update(updateData);
};

/*
 * update test data user
 *
 * npm run exec-trial-ts-file src/models/user/update.ts
 */
main(update, "dummy_user_id", {
  first_name: "John",
  last_name: "Doe",
});
