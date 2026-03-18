// presentation
import { NextRequest, NextResponse } from "next/server";
// service
import { ai } from "@/lib/ai";
import type { PaperSummary } from "@/lib/ai/common";
import { sendWeeklyPaperDigestEmail } from "@/infra/email";
// repository
import { list } from "@/models/user/list";
import type { User } from "@/models/user";
import { fetchRecentMeditationPapers } from "@/infra/papers";
// DB / infrastructure
import { getAdminAuth } from "@/lib/firebaseAdmin";
import type { Auth } from "firebase-admin/auth";
// config / utils
import config from "@/config";
import { chunk } from "@/utils/array";

export const maxDuration = 300; // 5 minutes

type UserEntry = { id: string; firstName: string; email: string };

const groupUsersByLanguage = (
  users: User[],
): Record<string, UserEntry[]> =>
  users.reduce<Record<string, UserEntry[]>>((acc, user) => {
    const lang = user.language || "ja";
    return {
      ...acc,
      [lang]: [...(acc[lang] ?? []), { id: user.id, firstName: user.first_name, email: "" }],
    };
  }, {});

const fillEmailsFromAuth = async (
  userEntries: UserEntry[],
  adminAuth: Auth,
): Promise<void> => {
  await chunk(userEntries, 100).reduce(async (prev, batch) => {
    await prev;
    try {
      const { users: authUsers } = await adminAuth.getUsers(batch.map((u) => ({ uid: u.id })));
      const emailMap = new Map(authUsers.map((u) => [u.uid, u.email ?? ""]));
      batch.forEach((u) => { u.email = emailMap.get(u.id) ?? ""; });
    } catch (err) {
      console.error("Failed to batch fetch user emails:", err);
    }
  }, Promise.resolve());
};

type SendResult = { sent: number; errors: string[] };

const toErrorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : (typeof err === "object" ? JSON.stringify(err) : String(err));

const sendEmailsSequentially = (
  users: UserEntry[],
  lang: string,
  summaries: PaperSummary[],
): Promise<SendResult> =>
  users.reduce<Promise<SendResult>>(
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

type DigestResult = { totalSent: number; allErrors: string[]; summariesByLang: Record<string, PaperSummary[]> };

const processLanguages = (
  usersByLanguage: Record<string, UserEntry[]>,
  papers: Awaited<ReturnType<typeof fetchRecentMeditationPapers>>,
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

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${config.CRON_SECRET}`) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const activeUsers = await list({ status: "active" });
    if (activeUsers.length === 0) {
      return NextResponse.json({ success: true, sent: 0, message: "No active users" });
    }

    const papers = await fetchRecentMeditationPapers(5);
    if (papers.length === 0) {
      return NextResponse.json({ success: true, sent: 0, message: "No papers found" });
    }

    const usersByLanguage = groupUsersByLanguage(activeUsers);
    const adminAuth = await getAdminAuth();
    await fillEmailsFromAuth(Object.values(usersByLanguage).flat(), adminAuth);

    const { totalSent, allErrors, summariesByLang } = await processLanguages(usersByLanguage, papers);

    return NextResponse.json({
      success: true,
      sent: totalSent,
      summaries: summariesByLang,
      errors: allErrors.length > 0 ? allErrors : undefined,
    });
  } catch (error) {
    console.error("Weekly paper digest cron error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
