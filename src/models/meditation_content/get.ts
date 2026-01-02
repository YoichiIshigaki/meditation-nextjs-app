import { doc, getDoc } from "firebase/firestore";
import {
  meditationContent,
  toMeditationContent,
  type MeditationContent,
  type MeditationContentDoc,
} from "./";
import { main } from "@/models/common/util";

export const get = async (id: string): Promise<MeditationContent> => {
  const MeditationContentDocRef = doc(await meditationContent(), id);
  const MeditationContentDocSnap = await getDoc(MeditationContentDocRef);

  if (MeditationContentDocSnap.exists()) {
    // ドキュメントデータを取得し、idを付与して返す
    return toMeditationContent(
      MeditationContentDocSnap.id,
      MeditationContentDocSnap.data() as MeditationContentDoc,
    );
  }
  // ドキュメントが存在しない場合
  console.error(`MeditationContent with id ${id} not found.`);
  throw new Error(`MeditationContent with id ${id} not found.`);
};

/*
 * get test data meditation content
 *
 * npm run exec-trial-ts-file src/models/meditation_content/get.ts
 */
main(get, "id_0");
