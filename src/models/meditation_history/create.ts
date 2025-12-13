import { addDoc, serverTimestamp } from 'firebase/firestore';
import { meditationHistory, type MeditationHistory, type MeditationHistoryDoc } from './';

type MeditationHistoryCreateParam = Omit<MeditationHistory, 'id' | 'created_at' | 'updated_at'>

export const create = async (param: MeditationHistoryCreateParam): Promise<string> => {
  const collectionRef = await meditationHistory();
  
  // Firestoreに保存するデータを作成
  // created_atとupdated_atはserverTimestamp()を使用してサーバー側で設定
  const docData: Omit<MeditationHistoryDoc, 'id' | 'created_at' | 'updated_at'> & {
    created_at: ReturnType<typeof serverTimestamp>;
    updated_at: ReturnType<typeof serverTimestamp>;
  } = {
    user_id: param.user_id,
    meditation_id: param.meditation_id,
    duration: param.duration,
    score: param.score,
    date: param.date,
    mindfulness_score: param.mindfulness_score,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };

  // ドキュメントを追加（自動ID生成）
  const docRef = await addDoc(collectionRef, docData);
  
  return docRef.id;
}

/**
 * @description
 * add test data meditation histories
 * @example
 * 
 * npm run exec-trial-ts-file src/models/meditation_history/create.ts
 */
(async () => {
  if (require.main === module) {
    await create({
      user_id: 'user_1',
      meditation_id: 'meditation_1',
      duration: 15,
      score: 100,
      date: '2025-01-01',
      mindfulness_score: 80,
    }).then((createdId) => { console.log(createdId) })
    process.exit(0)
  }
})();


