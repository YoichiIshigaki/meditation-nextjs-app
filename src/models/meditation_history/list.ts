import {
  getDocs,
  query,
  orderBy,
  limit,
  type QueryConstraint,
  where,
} from "firebase/firestore";
import {
  meditationHistory,
  toMeditationHistory,
  type MeditationHistory,
  type MeditationHistoryDoc,
} from "./";

type ListOptions = {
  userId?: string;
  limitCount?: number;
  orderByField?: keyof MeditationHistory;
  orderDirection?: "asc" | "desc";
  between?: {
    start: Date;
    end: Date;
  };
};

export const list = async (
  options?: ListOptions,
): Promise<MeditationHistory[]> => {
  const collectionRef = await meditationHistory();

  // クエリ制約を構築
  const constraints: QueryConstraint[] = [];

  // 特定ユーザーの履歴に絞り込み（任意）
  if (options?.userId) {
    constraints.push(where("user_id", "==", options.userId));
  }

  // ソート順を設定（デフォルトはcreated_atの降順）
  const orderField = options?.orderByField || "created_at";
  const orderDir = options?.orderDirection || "desc";
  constraints.push(orderBy(orderField, orderDir));

  // 日付で絞り込みを行う。
  if (options?.between) {
    constraints.push(where("date", ">=", options.between.start));
    constraints.push(where("date", "<=", options.between.end));
  }

  // 取得件数の制限
  if (options?.limitCount) {
    constraints.push(limit(options.limitCount));
  }

  // クエリを実行
  const q = query(collectionRef, ...constraints);
  const querySnapshot = await getDocs(q);

  // ドキュメントを配列に変換
  const histories: MeditationHistory[] = [];
  querySnapshot.forEach((docSnap) => {
    if (docSnap.exists()) {
      histories.push(
        toMeditationHistory(docSnap.id, docSnap.data() as MeditationHistoryDoc),
      );
    }
  });

  return histories;
};

/**
 * @description
 * list test data meditation histories
 * @example
 *
 * npm run exec-trial-ts-file src/models/meditation_history/list.ts
 */
(async () => {
  if (require.main === module) {
    await list({
      // userId: 'some-user-id', // 特定ユーザーに絞りたい場合は指定
      limitCount: 10,
      orderByField: "created_at",
      orderDirection: "desc",
    })
      .then((histories) => {
        console.log(`Found ${histories.length} meditation histories`);
        console.log(histories);
      })
      .catch((error) => {
        console.error("List failed:", error);
      });
    process.exit(0);
  }
})();
