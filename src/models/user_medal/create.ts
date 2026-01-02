import { addDoc, serverTimestamp, Timestamp } from "firebase/firestore";
import { userMedal, type UserMedal, type UserMedalDoc } from "./";
import { main } from "@/models/common/util";

type UserMedalCreateParam = Omit<UserMedal, "id" | "created_at" | "updated_at">;

export const create = async (param: UserMedalCreateParam): Promise<string> => {
  const collectionRef = await userMedal();

  // Firestoreに保存するデータを作成
  // earned_atはDateまたはTimestampに変換
  const earnedAt =
    param.earned_at instanceof Date
      ? Timestamp.fromDate(param.earned_at)
      : serverTimestamp();

  const docData: Omit<
    UserMedalDoc,
    "id" | "created_at" | "updated_at" | "earned_at"
  > & {
    earned_at: Timestamp | ReturnType<typeof serverTimestamp>;
    created_at: ReturnType<typeof serverTimestamp>;
    updated_at: ReturnType<typeof serverTimestamp>;
  } = {
    user_id: param.user_id,
    medal_id: param.medal_id,
    earned_at: earnedAt,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };

  // ドキュメントを追加（自動ID生成）
  const docRef = await addDoc(collectionRef, docData);

  return docRef.id;
};

/*
 * add test data user medals
 *
 * npm run exec-trial-ts-file src/models/user_medal/create.ts
 */
main(create, {
  user_id: "user_1",
  medal_id: "medal_1",
  earned_at: new Date(),
});