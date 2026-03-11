import type { MeditationPaper } from "@/infra/papers";
import type { PaperSummary } from "./common";
import anthropicService, { type AnthropicModel } from "./anthropic";
import geminiService, { type GeminiModel } from "./gemini";

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
  summarizePapersForLanguage: anthropicService.summarizePapersForLanguage,
};

const geminiStrategy: AIStrategy = {
  summarizePapersForLanguage: geminiService.summarizePapersForLanguage,
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
    this.provider = provider;
    this.strategy = AIContext.createStrategy(provider);
  }

  private validateModelForProvider(model: string, provider: AIProvider): void {
    const validModels: Record<AIProvider, string[]> = {
      claude: ["claude-haiku-4-5", "claude-sonnet-4-5", "claude-sonnet-4-6", "claude-opus-4-6"] satisfies AnthropicModel[],
      gemini: ["gemini-2.5-flash-lite", "gemini-2.5-flash", "gemini-2.0-flash", "gemini-2.5-pro"] satisfies GeminiModel[],
    };

    const modelsForProvider = validModels[provider];

    if (!modelsForProvider.includes(model)) {
      throw new Error(`Model ${model} is not valid for provider ${provider} (${provider} supports: ${modelsForProvider.join(", ")})`);
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

// デフォルトインスタンス（gemini）
export const ai = new AIContext("gemini");
