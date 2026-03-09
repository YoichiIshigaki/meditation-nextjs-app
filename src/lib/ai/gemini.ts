import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import config from "@/config";
import type { MeditationPaper } from "@/infra/papers";
import { LANGUAGE_LABELS, SUMMARY_PROMPTS, sanitizeText } from "./common";
import type { PaperSummary } from "@/lib/ai/common";

export type GeminiModel = "gemini-2.0-flash" | "gemini-2.0-pro" | "gemini-1.5-flash" | "gemini-1.5-pro";

const google = createGoogleGenerativeAI({ apiKey: config.GEMINI_API_KEY });

const callGemini = async (prompt: string, model: GeminiModel = "gemini-2.0-flash"): Promise<string> => {
  const { text } = await generateText({
    model: google(model),
    maxOutputTokens: 2048,
    prompt,
  });
  return text;
};

export const summarizePapersForLanguage = async (
  papers: MeditationPaper[],
  language: string,
  model: GeminiModel = "gemini-2.0-flash",
): Promise<PaperSummary[]> => {
  const lang = LANGUAGE_LABELS[language] ? language : "ja";
  const prompt = SUMMARY_PROMPTS[lang];

  const results = await Promise.all(
    papers.map(async (paper) => {
      const fullPrompt = `${prompt}\n\nTitle: ${paper.title}\nAbstract: ${paper.abstract}`;
      const rawSummary = await callGemini(fullPrompt, model);
      return {
        id: paper.id,
        title: paper.title,
        authors: paper.authors,
        journal: paper.journal,
        pubDate: paper.pubDate,
        summary: sanitizeText(rawSummary),
      };
    }),
  );

  return results;
};
