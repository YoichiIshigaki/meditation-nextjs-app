export type PaperSummary = {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  pubDate: string;
  summary: string;
};

export const LANGUAGE_LABELS: Record<string, string> = {
  ja: "日本語",
  en: "English",
  es: "Español",
};

export const SUMMARY_PROMPTS: Record<string, string> = {
  ja: "以下の瞑想研究論文のアブストラクトを、一般の読者向けに日本語で3〜5文で分かりやすく要約してください。専門用語は避け、実践的な意義を強調してください。",
  en: "Summarize the following meditation research paper abstract in 3-5 sentences for a general audience in English. Avoid jargon and emphasize practical implications.",
  es: "Resume el siguiente resumen de investigación sobre meditación en 3-5 oraciones en español para una audiencia general. Evita la jerga y enfatiza las implicaciones prácticas.",
};

// Strip HTML tags from LLM output to prevent HTML injection in emails
export const sanitizeText = (text: string): string =>
  text.replace(/<[^>]*>/g, "").trim();