import {
  getDocs,
  query,
  orderBy,
  limit,
  where,
  type QueryConstraint,
} from "firebase/firestore";
import { userMedal, toUserMedal, type UserMedal, type UserMedalDoc } from "./";
import { main } from "@/models/common/util";

type ListOptions = {
  userId?: string;
  medalId?: string;
  limitCount?: number;
  orderByField?: keyof UserMedal;
  orderDirection?: "asc" | "desc";
};

export const list = async (options?: ListOptions): Promise<UserMedal[]> => {
  const collectionRef = await userMedal();

  // クエリ制約を構築
  const constraints: QueryConstraint[] = [];

  // 特定ユーザーのメダルに絞り込み（任意）
  if (options?.userId) {
    constraints.push(where("user_id", "==", options.userId));
  }

  // 特定メダルIDに絞り込み（任意）
  if (options?.medalId) {
    constraints.push(where("medal_id", "==", options.medalId));
  }

  // ソート順を設定（デフォルトはcreated_atの降順）
  const orderField = options?.orderByField || "created_at";
  const orderDir = options?.orderDirection || "desc";
  constraints.push(orderBy(orderField, orderDir));

  // 取得件数の制限
  if (options?.limitCount) {
    constraints.push(limit(options.limitCount));
  }

  // クエリを実行
  const q = query(collectionRef, ...constraints);
  const querySnapshot = await getDocs(q);

  // ドキュメントを配列に変換
  const userMedals: UserMedal[] = [];
  querySnapshot.forEach((docSnap) => {
    if (docSnap.exists()) {
      userMedals.push(toUserMedal(docSnap.id, docSnap.data() as UserMedalDoc));
    }
  });

  return userMedals;
};

/*
 * list test data user medals
 *
 * npm run exec-trial-ts-file src/models/user_medal/list.ts
 */
main(list, {
  userId: "user_1",
  limitCount: 10,
  orderByField: "created_at",
  orderDirection: "desc",
});