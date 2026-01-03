import { addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { user, type User, type UserDoc } from "./";
import { main } from "@/models/common/util";

type UserCreateParam = Omit<User, "id" | "created_at" | "updated_at">;

export const create = async (param: UserCreateParam): Promise<string> => {
  const collectionRef = await user();

  // Firestoreに保存するデータを作成
  // created_atとupdated_atは自動的に設定
  const docData: Omit<UserDoc, "id" | "created_at" | "updated_at"> & {
    created_at: ReturnType<typeof serverTimestamp>;
    updated_at: ReturnType<typeof serverTimestamp>;
    last_logged_in: Timestamp;
  } = {
    ...param,
    last_logged_in: Timestamp.fromDate(param.last_logged_in),
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };

  // ドキュメントを追加（自動ID生成）
  const docRef = await addDoc(collectionRef, docData);

  return docRef.id;
};

/*
 * create test data user
 *
 * npm run exec-trial-ts-file src/models/user/create.ts
 */
main(create, {
  first_name: "John",
  last_name: "Doe",
  thumbnail_url: "",
  language: "en",
  last_logged_in: new Date(),
  status: "active",
});
