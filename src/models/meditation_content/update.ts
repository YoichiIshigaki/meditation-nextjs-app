import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { meditationContent, type MeditationContent } from "./";

type MeditationContentUpdateParam = Partial<
  Omit<MeditationContent, "id" | "created_at" | "updated_at">
>;

export const update = async (
  id: string,
  param: MeditationContentUpdateParam,
): Promise<void> => {
  const collectionRef = await meditationContent();
  const docRef = doc(collectionRef, id);

  // Firestoreに保存するデータを作成
  // updated_atのみを更新（created_atは変更しない）
  const updateData: {
    title?: string;
    description?: string;
    image_url?: string;
    audio_url?: string;
    video_url?: string;
    duration?: number;
    updated_at: ReturnType<typeof serverTimestamp>;
  } = {
    ...(param.title !== undefined && { title: param.title }),
    ...(param.description !== undefined && { description: param.description }),
    ...(param.image_url !== undefined && { image_url: param.image_url }),
    ...(param.audio_url !== undefined && { audio_url: param.audio_url }),
    ...(param.video_url !== undefined && { video_url: param.video_url }),
    ...(param.duration !== undefined && { duration: param.duration }),
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
      title: "updated title",
      description: "updated description",
    }).then(() => {
      console.log("Updated successfully");
    });
    process.exit(0);
  }
})();
