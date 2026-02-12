import { z } from "zod";

type TranslationFunction = (key: string) => string;

// API用のスキーマ - サーバーサイド用
export const meditationContentSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  image_url: z.string().url().optional().or(z.literal("")),
  audio_url: z.string().url().optional().or(z.literal("")),
  video_url: z.string().url().optional().or(z.literal("")),
  duration: z.number().min(0),
  language: z.string().min(2).max(10),
  category_id: z.string().min(1),
});

export type MeditationContentSchema = z.infer<typeof meditationContentSchema>;

// 更新用スキーマ（すべてオプショナル）
export const meditationContentUpdateSchema = meditationContentSchema.partial();

export type MeditationContentUpdateSchema = z.infer<typeof meditationContentUpdateSchema>;

// フォーム用のスキーマを生成する関数（翻訳対応）
export const createMeditationContentFormSchema = (t: TranslationFunction) =>
  z.object({
    title: z
      .string()
      .min(1, t("admin:validation_title_required"))
      .max(200, t("admin:validation_title_max")),
    description: z
      .string()
      .min(1, t("admin:validation_description_required"))
      .max(2000, t("admin:validation_description_max")),
    image_url: z.string().url(t("admin:validation_url_invalid")).optional().or(z.literal("")),
    audio_url: z.string().url(t("admin:validation_url_invalid")).optional().or(z.literal("")),
    video_url: z.string().url(t("admin:validation_url_invalid")).optional().or(z.literal("")),
    duration: z.number().min(0, t("admin:validation_duration_min")),
    language: z.string().min(2, t("admin:validation_language_required")),
    category_id: z.string().min(1, t("admin:validation_category_required")),
  });

export type MeditationContentFormSchema = z.infer<ReturnType<typeof createMeditationContentFormSchema>>;
