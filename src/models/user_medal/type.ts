import type { Timestamp } from "firebase/firestore";
import type { MediMateType, MediMateDocType } from "../common/type";

export type UserMedalDoc = MediMateDocType<{
  user_id: string;
  medal_id: string;
  earned_at: Timestamp; // 獲得日時
}>;

export type UserMedal = MediMateType<{
  user_id: string;
  medal_id: string;
  earned_at: Date; // 獲得日時
  created_at: Date;
  updated_at: Date;
}>;

export const toUserMedal = (
  id: string,
  userMedalDoc: UserMedalDoc,
): UserMedal => ({
  id,
  user_id: userMedalDoc.user_id,
  medal_id: userMedalDoc.medal_id,
  earned_at: userMedalDoc.earned_at.toDate(),
  created_at: userMedalDoc.created_at.toDate(),
  updated_at: userMedalDoc.updated_at.toDate(),
});
