import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import config from "@/config";
import type { MeditationPaper } from "@/infra/papers";
import { LANGUAGE_LABELS, SUMMARY_PROMPTS, sanitizeText } from "./common";
import type { PaperSummary } from "@/lib/ai/common";

const anthropic = createAnthropic({ apiKey: config.ANTHROPIC_API_KEY });

export type AnthropicModel = Parameters<typeof anthropic>[0];

export const DEFAULT_MODEL = "claude-haiku-4-5" satisfies AnthropicModel;

export const callClaude = async (prompt: string, model: AnthropicModel = DEFAULT_MODEL): Promise<string> => {
  const { text } = await generateText({
    model: anthropic(model),
    maxOutputTokens: 2048,
    prompt,
  });
  return text;
};

const summarizePapersForLanguage = async (
  papers: MeditationPaper[],
  language: string,
  model: AnthropicModel = DEFAULT_MODEL,
): Promise<PaperSummary[]> => {
  const lang = LANGUAGE_LABELS[language] ? language : "ja";
  const prompt = SUMMARY_PROMPTS[lang];

  const results = await Promise.all(
    papers.map(async (paper) => {
      const fullPrompt = `${prompt}\n\nTitle: ${paper.title}\nAbstract: ${paper.abstract}`;
      const rawSummary = await callClaude(fullPrompt, model);
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

const anthropicService = {
  summarizePapersForLanguage,
};

export default anthropicService;