import {
  getDocs,
  query,
  orderBy,
  where,
  limit,
  type QueryConstraint,
} from "firebase/firestore";
import {
  meditationMedal,
  toMeditationMedal,
  type MeditationMedal,
  type MeditationMedalDoc,
} from ".";
import { main } from "@/models/common/util";

type ListOptions = {
  limitCount?: number;
  orderByField?: keyof MeditationMedal;
  medalIds?: string[];
  orderDirection?: "asc" | "desc";
};

export const list = async (
  options?: ListOptions,
): Promise<MeditationMedal[]> => {
  if (options?.medalIds && options.medalIds.length > 10) {
    throw new Error("too many ids for list query");
  }

  const collectionRef = await meditationMedal();

  // クエリ制約を構築
  const constraints: QueryConstraint[] = [];

  // ソート順を設定（デフォルトはcreated_atの降順）
  const orderField = options?.orderByField || "created_at";
  const orderDir = options?.orderDirection || "desc";
  constraints.push(orderBy(orderField, orderDir));

  // idからデータを取得
  if (options?.medalIds) {
    constraints.push(where("id", "in", options.medalIds));
  }

  // 取得件数の制限
  if (options?.limitCount) {
    constraints.push(limit(options.limitCount));
  }

  // クエリを実行
  const q = query(collectionRef, ...constraints);
  const querySnapshot = await getDocs(q);

  // ドキュメントを配列に変換
  const meditationMedals: MeditationMedal[] = [];
  querySnapshot.forEach((docSnap) => {
    if (docSnap.exists()) {
      meditationMedals.push(
        toMeditationMedal(docSnap.id, docSnap.data() as MeditationMedalDoc),
      );
    }
  });

  return meditationMedals;
};

/*
 * list test data meditation medal
 *
 * npm run exec-trial-ts-file src/models/meditation_medal/list.ts
 */
main(list, {
  limitCount: 10,
  orderByField: "created_at",
  orderDirection: "desc",
});
