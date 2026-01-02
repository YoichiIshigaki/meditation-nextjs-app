import { doc, getDoc } from "firebase/firestore";
import {
  meditationMedal,
  toMeditationMedal,
  type MeditationMedal,
  type MeditationMedalDoc,
} from ".";
import { main } from "@/models/common/util";

export const get = async (id: string): Promise<MeditationMedal> => {
  const meditationMedalDocRef = doc(await meditationMedal(), id);
  const meditationMedalDocSnap = await getDoc(meditationMedalDocRef);

  if (meditationMedalDocSnap.exists()) {
    // ドキュメントデータを取得し、idを付与して返す
    return toMeditationMedal(
      meditationMedalDocSnap.id,
      meditationMedalDocSnap.data() as MeditationMedalDoc,
    );
  }
  // ドキュメントが存在しない場合
  console.error(`meditationMedal with id ${id} not found.`);
  throw new Error(`meditationMedal with id ${id} not found.`);
};

// npm run exec-trial-ts-file src/models/meditation_content/get.ts
main(get, "id_0");
