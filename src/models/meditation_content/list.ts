import { getDocs, query, orderBy, limit, type QueryConstraint } from 'firebase/firestore';
import { meditationContent, toMeditationContent, type MeditationContent, type MeditationContentDoc } from './';

type ListOptions = {
  limitCount?: number;
  orderByField?: keyof MeditationContent;
  orderDirection?: 'asc' | 'desc';
};

export const list = async (options?: ListOptions): Promise<MeditationContent[]> => {
  const collectionRef = await meditationContent();
  
  // クエリ制約を構築
  const constraints: QueryConstraint[] = [];
  
  // ソート順を設定（デフォルトはcreated_atの降順）
  const orderField = options?.orderByField || 'created_at';
  const orderDir = options?.orderDirection || 'desc';
  constraints.push(orderBy(orderField, orderDir));
  
  // 取得件数の制限
  if (options?.limitCount) {
    constraints.push(limit(options.limitCount));
  }
  
  // クエリを実行
  const q = query(collectionRef, ...constraints);
  const querySnapshot = await getDocs(q);
  
  // ドキュメントを配列に変換
  const meditationContents: MeditationContent[] = [];
  querySnapshot.forEach((docSnap) => {
    if (docSnap.exists()) {
      meditationContents.push(
        toMeditationContent(docSnap.id, docSnap.data() as MeditationContentDoc)
      );
    }
  });
  
  return meditationContents;
}

/**
 * @description
 * list test data meditation contents
 * @example
 * 
 * npm run exec-trial-ts-file src/models/meditation_content/list.ts
 */
(async () => {
  if (require.main === module) {
    await list({
      limitCount: 10,
      orderByField: 'created_at',
      orderDirection: 'desc',
    }).then((meditationContents) => { 
      console.log(`Found ${meditationContents.length} meditation contents`);
      console.log(meditationContents);
    }).catch((error) => {
      console.error('List failed:', error);
    });
    process.exit(0)
  }
})();

