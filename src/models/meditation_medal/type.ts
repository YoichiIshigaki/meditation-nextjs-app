import type { MediMateType, MediMateDocType } from "../common/type";

export type MeditationMedalDoc = MediMateDocType<{
  medal_name: string;
  description: string;
  image_url: string;
  // created_at と updated_at は MediMateDocType によって自動的に Timestamp 型として追加される
}>;

export type MeditationMedal = MediMateType<{
  medal_name: string;
  description: string;
  image_url: string;
  created_at: Date;
  updated_at: Date;
}>;

export const toMeditationMedal = (
  id: string,
  meditationMedalDoc: MeditationMedalDoc,
): MeditationMedal => ({
  id,
  medal_name: meditationMedalDoc.medal_name,
  description: meditationMedalDoc.description,
  image_url: meditationMedalDoc.image_url,
  created_at: meditationMedalDoc.created_at.toDate(),
  updated_at: meditationMedalDoc.updated_at.toDate(),
});
