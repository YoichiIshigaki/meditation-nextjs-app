import type { MeditationPaper } from "@/infra/papers";
import type { PaperSummary } from "./common";
import { summarizePapersForLanguage as summarizeWithClaude, type ClaudeModel } from "./anthropic";
import { summarizePapersForLanguage as summarizeWithGemini, type GeminiModel } from "./gemini";

// --- Strategy interface ---

interface AIStrategy {
  summarizePapersForLanguage(
    papers: MeditationPaper[],
    language: string,
    model?: string,
  ): Promise<PaperSummary[]>;
}

// --- Concrete strategies ---

const claudeStrategy: AIStrategy = {
  summarizePapersForLanguage: summarizeWithClaude,
};

const geminiStrategy: AIStrategy = {
  summarizePapersForLanguage: summarizeWithGemini,
};

// --- Context ---

export type AIProvider = "claude" | "gemini";

export class AIContext {
  private strategy: AIStrategy;
  private provider: AIProvider;

  constructor(provider: AIProvider = "claude") {
    this.provider = provider;
    this.strategy = AIContext.createStrategy(provider);
  }

  private static createStrategy(provider: AIProvider): AIStrategy {
    switch (provider) {
      case "claude":
        return claudeStrategy;
      case "gemini":
        return geminiStrategy;
    }
  }

  setProvider(provider: AIProvider): void {
    this.strategy = AIContext.createStrategy(provider);
  }
  private validateModelForProvider(model: string, provider: AIProvider): void {
    const validModels = {
      claude: ["claude-sonnet-4-6", "claude-3-5-sonnet", "claude-3-opus"] satisfies ClaudeModel[],
      gemini: ["gemini-2.0-flash", "gemini-2.0-pro", "gemini-1.5-flash", "gemini-1.5-pro"] satisfies GeminiModel[],
    };

    if (!(validModels[provider] as string[]).includes(model)) {
      throw new Error(`Model ${model} is not valid for provider ${provider}`);
    }
  }

  summarizePapersForLanguage(
    papers: MeditationPaper[],
    language: string,
    model?: string,
  ): Promise<PaperSummary[]> {
    if (model) {
      this.validateModelForProvider(model, this.provider);
    }
    return this.strategy.summarizePapersForLanguage(papers, language, model);
  }
}

// デフォルトインスタンス（claude）
export const ai = new AIContext("claude");
