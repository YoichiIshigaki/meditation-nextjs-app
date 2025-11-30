import { addDoc, serverTimestamp } from 'firebase/firestore';
import { meditationContent, type MeditationContent, type MeditationContentDoc } from './';

type MeditationContentCreateParam = Omit<MeditationContent, 'id' | 'created_at' | 'updated_at'>

export const create = async (param: MeditationContentCreateParam): Promise<string> => {
  const collectionRef = await meditationContent();
  
  // Firestoreに保存するデータを作成
  // created_atとupdated_atはserverTimestamp()を使用してサーバー側で設定
  const docData: Omit<MeditationContentDoc, 'id' | 'created_at' | 'updated_at'> & {
    created_at: ReturnType<typeof serverTimestamp>;
    updated_at: ReturnType<typeof serverTimestamp>;
  } = {
    title: param.title,
    description: param.description,
    image_url: param.image_url,
    audio_url: param.audio_url,
    video_url: param.video_url,
    duration: param.duration,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  };

  // ドキュメントを追加（自動ID生成）
  const docRef = await addDoc(collectionRef, docData);
  
  return docRef.id;
}

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
      title: 'title',
      description: 'description',
      image_url: 'image_url',
      audio_url: 'audio_url',
      video_url: 'video_url',
      duration: 10
    }).then((createdId) => { console.log(createdId) })
    process.exit(0)
  }
})();
