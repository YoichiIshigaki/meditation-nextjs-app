import { doc, getDoc } from 'firebase/firestore';
import { meditationHistory, toMeditationHistory, type MeditationHistory, type MeditationHistoryDoc } from './';

export const get = async (id: string): Promise<MeditationHistory> => {
  const MeditationHistoryDocRef = doc((await meditationHistory()), id);
  const MeditationHistoryDocSnap = await getDoc(MeditationHistoryDocRef);

  if (MeditationHistoryDocSnap.exists()) {
    // ドキュメントデータを取得し、idを付与して返す
    return toMeditationHistory(MeditationHistoryDocSnap.id, MeditationHistoryDocSnap.data() as MeditationHistoryDoc);
  }
  // ドキュメントが存在しない場合
  console.error(`MeditationHistory with id ${id} not found.`);
  throw new Error(`MeditationHistory with id ${id} not found.`);
}

// npm run exec-trial-ts-file src/models/meditation_history/get.ts
(async () => {
  if (require.main === module) {
    const id = "96WSUBF5c4EJSWCbhwry";
    await get(id).then((meditationHistory) => { console.log(meditationHistory) })
    process.exit(0)
  }
})();
