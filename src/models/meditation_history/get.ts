import { doc, getDoc } from "firebase/firestore";
import {
  meditationHistory,
  toMeditationHistory,
  type MeditationHistory,
  type MeditationHistoryDoc,
} from "./";
import { main } from "@/models/common/util";

export const get = async (id: string): Promise<MeditationHistory> => {
  const MeditationHistoryDocRef = doc(await meditationHistory(), id);
  const MeditationHistoryDocSnap = await getDoc(MeditationHistoryDocRef);

  if (MeditationHistoryDocSnap.exists()) {
    // ドキュメントデータを取得し、idを付与して返す
    return toMeditationHistory(
      MeditationHistoryDocSnap.id,
      MeditationHistoryDocSnap.data() as MeditationHistoryDoc,
    );
  }
  // ドキュメントが存在しない場合
  console.error(`MeditationHistory with id ${id} not found.`);
  throw new Error(`MeditationHistory with id ${id} not found.`);
};

/*
 * get test data meditation history
 *
 * npm run exec-trial-ts-file src/models/meditation_history/get.ts
 */
main(get, "96WSUBF5c4EJSWCbhwry");
