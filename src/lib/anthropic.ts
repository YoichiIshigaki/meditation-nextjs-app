import config from "@/config";
import type { MeditationPaper } from "@/infra/papers";

export type PaperSummary = {
  id: string;
  title: string;
  authors: string[];
  journal: string;
  pubDate: string;
  summary: string;
};

type AnthropicMessage = {
  role: "user" | "assistant";
  content: string;
};

type AnthropicRequest = {
  model: string;
  max_tokens: number;
  messages: AnthropicMessage[];
};

type AnthropicResponse = {
  content: Array<{ type: string; text: string }>;
};

const callClaude = async (prompt: string): Promise<string> => {
  const body: AnthropicRequest = {
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    messages: [{ role: "user", content: prompt }],
  };

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(`Anthropic API error: ${res.status} ${error}`);
  }

  const data = (await res.json()) as AnthropicResponse;
  return data.content[0]?.text ?? "";
};

const LANGUAGE_LABELS: Record<string, string> = {
  ja: "日本語",
  en: "English",
  es: "Español",
};

const SUMMARY_PROMPTS: Record<string, string> = {
  ja: "以下の瞑想研究論文のアブストラクトを、一般の読者向けに日本語で3〜5文で分かりやすく要約してください。専門用語は避け、実践的な意義を強調してください。",
  en: "Summarize the following meditation research paper abstract in 3-5 sentences for a general audience in English. Avoid jargon and emphasize practical implications.",
  es: "Resume el siguiente resumen de investigación sobre meditación en 3-5 oraciones en español para una audiencia general. Evita la jerga y enfatiza las implicaciones prácticas.",
};

// Strip HTML tags from LLM output to prevent HTML injection in emails
const sanitizeText = (text: string): string =>
  text.replace(/<[^>]*>/g, "").trim();

export const summarizePapersForLanguage = async (
  papers: MeditationPaper[],
  language: string,
): Promise<PaperSummary[]> => {
  const lang = LANGUAGE_LABELS[language] ? language : "ja";
  const prompt = SUMMARY_PROMPTS[lang];

  const results = await Promise.all(
    papers.map(async (paper) => {
      const fullPrompt = `${prompt}\n\nTitle: ${paper.title}\nAbstract: ${paper.abstract}`;
      const rawSummary = await callClaude(fullPrompt);
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
