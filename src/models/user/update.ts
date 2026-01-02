import { doc, updateDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { user, type User } from "./";
import { main } from "@/models/common/util";

type UserUpdateParam = Partial<Omit<User, "id" | "created_at" | "updated_at">>;

export const update = async (
  id: string,
  param: UserUpdateParam,
): Promise<void> => {
  const collectionRef = await user();
  const docRef = doc(collectionRef, id);

  // Firestoreに保存するデータを作成
  // updated_atのみを更新（created_atは変更しない）
  const updateData: {
    first_name?: string;
    last_name?: string;
    thumbnail_url?: string;
    language?: string;
    last_logged_in?: Timestamp;
    status?: string;
    updated_at: ReturnType<typeof serverTimestamp>;
  } = {
    ...Object.fromEntries(
      Object.entries(param).filter(([_, v]) => v !== undefined),
    ),
    ...Object.fromEntries(
      Object.entries(param)
        .filter(([_, v]) => v instanceof Date)
        .map(([k, v]) => [k, Timestamp.fromDate(v as Date)]),
    ),
    updated_at: serverTimestamp(),
  };

  // ドキュメントを更新
  await updateDoc(docRef, updateData);
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
