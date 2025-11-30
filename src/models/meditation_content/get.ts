import { doc, getDoc } from 'firebase/firestore';
import { meditationContent, toMeditationContent, type MeditationContent, type MeditationContentDoc } from './';

export const get = async (id: string): Promise<MeditationContent> => {
  const MeditationContentDocRef = doc((await meditationContent()), id);
  const MeditationContentDocSnap = await getDoc(MeditationContentDocRef);

  if (MeditationContentDocSnap.exists()) {
    // ドキュメントデータを取得し、idを付与して返す
    return toMeditationContent(MeditationContentDocSnap.id, MeditationContentDocSnap.data() as MeditationContentDoc);
  }
  // ドキュメントが存在しない場合
  console.error(`MeditationContent with id ${id} not found.`);
  throw new Error(`MeditationContent with id ${id} not found.`);
}

// npm run exec-trial-ts-file src/models/meditation_content/get.ts
(async () => {
  if (require.main === module) {
    const id = "id_0";
    await get(id).then((meditationContent) => { console.log(meditationContent) })
    process.exit(0)
  }
})();
