import type { MediMateType, MediMateDocType } from "../common/type";

export type MeditationContentDoc = MediMateDocType<{
  id: string;
  title: string;
  description: string;
  image_url: string;
  audio_url: string;
  video_url: string;
  duration: number;
  // created_at と updated_at は MediMateDocType によって自動的に Timestamp 型として追加される
}>;

export type MeditationContent = MediMateType<{
  id: string;
  title: string;
  description: string;
  image_url: string;
  audio_url: string;
  video_url: string;
  duration: number;
  created_at: Date;
  updated_at: Date;
}>;

export const toMeditationContent = (
  id: string,
  meditationContentDoc: MeditationContentDoc,
): MeditationContent => ({
  id,
  title: meditationContentDoc.title,
  description: meditationContentDoc.description,
  image_url: meditationContentDoc.image_url,
  audio_url: meditationContentDoc.audio_url,
  video_url: meditationContentDoc.video_url,
  duration: meditationContentDoc.duration,
  created_at: meditationContentDoc.created_at.toDate(),
  updated_at: meditationContentDoc.updated_at.toDate(),
});
