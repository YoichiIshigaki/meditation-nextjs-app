import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { meditationMedal, type MeditationMedal } from ".";

type MeditationContentUpdateParam = Partial<
  Omit<MeditationMedal, "id" | "created_at" | "updated_at">
>;

export const update = async (
  id: string,
  param: MeditationContentUpdateParam,
): Promise<void> => {
  const collectionRef = await meditationMedal();
  const docRef = doc(collectionRef, id);

  // Firestoreに保存するデータを作成
  // updated_atのみを更新（created_atは変更しない）
  const updateData: {
    title?: string;
    description?: string;
    image_url?: string;
    updated_at: ReturnType<typeof serverTimestamp>;
  } = {
    ...(param.medal_name !== undefined && { title: param.medal_name }),
    ...(param.description !== undefined && { description: param.description }),
    ...(param.image_url !== undefined && { image_url: param.image_url }),
    updated_at: serverTimestamp(),
  };

  // ドキュメントを更新
  await updateDoc(docRef, updateData);
};

/**
 * @description
 * update test data meditation contents
 * @example
 *
 * npm run exec-trial-ts-file src/models/meditation_content/update.ts
 */
(async () => {
  if (require.main === module) {
    const id = "rvnCsTHo6ijt9cRuznb2"; // 更新するドキュメントのID
    await update(id, {
      medal_name: "updated medal_name",
      description: "updated description",
    }).then(() => {
      console.log("Updated successfully");
    });
    process.exit(0);
  }
})();
