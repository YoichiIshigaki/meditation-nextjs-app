import { addDoc, serverTimestamp } from "firebase/firestore";
import {
  meditationMedal,
  type MeditationMedal,
  type MeditationMedalDoc,
} from ".";

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

/**
 * @description
 * add test data meditation contents
 * @example
 *
 * npm run exec-trial-ts-file src/models/meditation_content/create.ts
 */
(async () => {
  if (require.main === module) {
    await create({
      medal_name: "medal_name",
      description: "description",
      image_url: "image_url",
    }).then((createdId) => {
      console.log(createdId);
    });
    process.exit(0);
  }
})();
