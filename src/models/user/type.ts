import type { Timestamp } from "firebase/firestore";
import type { MediMateDocType, MediMateType } from "../common/type";

/**
 * ユーザーロール
 * user: 一般ユーザー
 * admin: 管理者
 * root: スーパーユーザー
 */
export type UserRole = "user" | "admin" | "root";

export type UserDoc = MediMateDocType<{
  id: string;
  first_name: string;
  last_name: string;
  thumbnail_url: string;
  language: string;
  last_logged_in: Timestamp;
  status: string;
  role: UserRole;
}>;

export type User = MediMateType<{
  id: string;
  first_name: string;
  last_name: string;
  thumbnail_url: string;
  language: string;
  last_logged_in: Date;
  status: string;
  role: UserRole;
}>;

/**
 * 会員ステータス
 * active: 有効
 * inactive: 退会
 * deleted: 削除
 * suspended: 強制退会
 */
export type Status = "active" | "inactive" | "deleted";

export const toUser = (id: string, userDoc: UserDoc): User => ({
  id,
  first_name: userDoc.first_name,
  last_name: userDoc.last_name,
  thumbnail_url: userDoc.thumbnail_url,
  language: userDoc.language,
  last_logged_in: userDoc.last_logged_in.toDate(),
  status: userDoc.status,
  role: userDoc.role ?? "user",
  created_at: userDoc.created_at.toDate(),
  updated_at: userDoc.updated_at.toDate(),
});
