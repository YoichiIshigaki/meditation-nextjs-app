import { addDoc, serverTimestamp } from "firebase/firestore";
import {
  meditationMedal,
  type MeditationMedal,
  type MeditationMedalDoc,
} from ".";
import { main } from "@/models/common/util";

type MeditationContentCreateParam = Omit<
  MeditationMedal,
  "id" | "created_at" | "updated_at"
>;

export const create = async (
  param: MeditationContentCreateParam,
): Promise<string> => {
  const collectionRef = await meditationMedal();

  // Firestoreに保存するデータを作成
  // created_atとupdated_atはserverTimestamp()を使用してサーバー側で設定
  const docData: Omit<
    MeditationMedalDoc,
    "id" | "created_at" | "updated_at"
  > & {
    created_at: ReturnType<typeof serverTimestamp>;
    updated_at: ReturnType<typeof serverTimestamp>;
  } = {
    medal_name: param.medal_name,
    description: param.description,
    image_url: param.image_url,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };

  // ドキュメントを追加（自動ID生成）
  const docRef = await addDoc(collectionRef, docData);

  return docRef.id;
};

/*
 * add test data meditation medal
 *
 * npm run exec-trial-ts-file src/models/meditation_medal/create.ts
 */
main(create, {
  medal_name: "medal_name",
  description: "description",
  image_url: "image_url",
});
