import type { MediMateType, MediMateDocType } from "../common/type";

export type MeditationHistoryDoc = MediMateDocType<{
  id: string; // ${user_id}_${meditation_id} ユーザーID_コンテンツIDの形式
  user_id: string;
  meditation_id: string; // コンテンツのID
  duration: number; // 瞑想した時間
  score: number; // 瞑想したスコア
  date: string; // yyyy-mm-dd
  mindfulness_score: number;
}>;

export type MeditationHistory = MediMateType<{
  id: string; // ${user_id}_${meditation_id} ユーザーID_コンテンツIDの形式
  user_id: string;
  meditation_id: string; // コンテンツのID
  duration: number;
  score: number;
  date: string; // yyyy-mm-dd
  mindfulness_score: number;
  created_at: Date;
  updated_at: Date;
}>;

export const toMeditationHistory = (
  id: string,
  meditationHistoryDoc: MeditationHistoryDoc,
): MeditationHistory => ({
  id,
  user_id: meditationHistoryDoc.user_id,
  meditation_id: meditationHistoryDoc.meditation_id,
  duration: meditationHistoryDoc.duration,
  score: meditationHistoryDoc.score,
  date: meditationHistoryDoc.date,
  mindfulness_score: meditationHistoryDoc.mindfulness_score,
  created_at: meditationHistoryDoc.created_at.toDate(),
  updated_at: meditationHistoryDoc.updated_at.toDate(),
});
