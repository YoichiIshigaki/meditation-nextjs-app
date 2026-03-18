import { ai } from "@/lib/ai";
import type { PaperSummary } from "@/lib/ai/common";
import { sendWeeklyPaperDigestEmail } from "@/infra/email";
import type { MeditationPaper } from "@/infra/papers";
import type { User } from "@/models/user";
import type { UserEntry } from "@/repository/userRepository";

export type DigestResult = {
  totalSent: number;
  allErrors: string[];
  summariesByLang: Record<string, PaperSummary[]>;
};

export const groupUsersByLanguage = (
  users: User[],
): Record<string, UserEntry[]> =>
  users.reduce<Record<string, UserEntry[]>>((acc, user) => {
    const lang = user.language || "ja";
    return {
      ...acc,
      [lang]: [...(acc[lang] ?? []), { id: user.id, firstName: user.first_name, email: "" }],
    };
  }, {});

const toErrorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : (typeof err === "object" ? JSON.stringify(err) : String(err));

const sendEmailsSequentially = (
  users: UserEntry[],
  lang: string,
  summaries: PaperSummary[],
): Promise<{ sent: number; errors: string[] }> =>
  users.reduce<Promise<{ sent: number; errors: string[] }>>(
    async (accPromise, user, i) => {
      const acc = await accPromise;
      if (i > 0) await new Promise((r) => setTimeout(r, 600)); // stay under 2 req/s
      try {
        await sendWeeklyPaperDigestEmail(user.email, user.firstName, lang, summaries);
        return { ...acc, sent: acc.sent + 1 };
      } catch (err) {
        console.error(`Failed to send email to ${user.email}:`, err);
        return { ...acc, errors: [...acc.errors, `Email failed for user ${user.id}: ${toErrorMessage(err)}`] };
      }
    },
    Promise.resolve({ sent: 0, errors: [] }),
  );

export const processLanguages = (
  usersByLanguage: Record<string, UserEntry[]>,
  papers: MeditationPaper[],
): Promise<DigestResult> =>
  Object.entries(usersByLanguage).reduce<Promise<DigestResult>>(
    async (accPromise, [lang, langUsers]) => {
      const acc = await accPromise;
      try {
        const summaries = await ai.summarizePapersForLanguage(papers, lang);
        const { sent, errors } = await sendEmailsSequentially(
          langUsers.filter((u) => u.email),
          lang,
          summaries,
        );
        return {
          totalSent: acc.totalSent + sent,
          allErrors: [...acc.allErrors, ...errors],
          summariesByLang: { ...acc.summariesByLang, [lang]: summaries },
        };
      } catch (err) {
        console.error(`Failed to summarize papers for language ${lang}:`, err);
        return { ...acc, allErrors: [...acc.allErrors, `Summarization failed for ${lang}`] };
      }
    },
    Promise.resolve({ totalSent: 0, allErrors: [], summariesByLang: {} }),
  );
