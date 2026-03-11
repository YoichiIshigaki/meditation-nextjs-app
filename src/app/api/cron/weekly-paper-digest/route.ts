import { NextRequest, NextResponse } from "next/server";
import config from "@/config";
import { list } from "@/models/user/list";
import { getAdminAuth } from "@/lib/firebaseAdmin";
import { fetchRecentMeditationPapers } from "@/infra/papers";
import { ai } from "@/lib/ai";
import { sendWeeklyPaperDigestEmail } from "@/infra/email";

export const maxDuration = 300; // 5 minutes

export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${config.CRON_SECRET}`) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch active users directly from Firestore with server-side filter
    const activeUsers = await list({ status: "active" });

    if (activeUsers.length === 0) {
      return NextResponse.json({ success: true, sent: 0, message: "No active users" });
    }

    // Fetch recent meditation papers from PubMed
    const papers = await fetchRecentMeditationPapers(5);

    if (papers.length === 0) {
      return NextResponse.json({ success: true, sent: 0, message: "No papers found" });
    }

    // Get Firebase Auth to retrieve user emails
    const adminAuth = await getAdminAuth();

    // Group users by language for efficient summarization
    const usersByLanguage = activeUsers.reduce<
      Record<string, Array<{ id: string; firstName: string; email: string }>>
    >((acc, user) => {
      const lang = user.language || "ja";
      if (!acc[lang]) acc[lang] = [];
      acc[lang].push({ id: user.id, firstName: user.first_name, email: "" });
      return acc;
    }, {});

    // Batch fetch emails from Firebase Auth (100 per request)
    const allUserEntries = Object.values(usersByLanguage).flat();
    const BATCH_SIZE = 100;
    for (let i = 0; i < allUserEntries.length; i += BATCH_SIZE) {
      const batch = allUserEntries.slice(i, i + BATCH_SIZE);
      const identifiers = batch.map((u) => ({ uid: u.id }));
      try {
        const { users: authUsers } = await adminAuth.getUsers(identifiers);
        const emailMap = new Map(authUsers.map((u) => [u.uid, u.email ?? ""]));
        batch.forEach((u) => { u.email = emailMap.get(u.id) ?? ""; });
      } catch (err) {
        console.error("Failed to batch fetch user emails:", err);
      }
    }

    let totalSent = 0;
    const errors: string[] = [];
    const summariesByLang: Record<string, unknown> = {};

    // For each language, summarize papers and send emails in parallel
    for (const [lang, langUsers] of Object.entries(usersByLanguage)) {
      let summaries;
      try {
        summaries = await ai.summarizePapersForLanguage(papers, lang);
        summariesByLang[lang] = summaries;
      } catch (err) {
        console.error(`Failed to summarize papers for language ${lang}:`, err);
        errors.push(`Summarization failed for ${lang}`);
        continue;
      }

      const eligibleUsers = langUsers.filter((u) => u.email);
      for (let i = 0; i < eligibleUsers.length; i++) {
        if (i > 0) await new Promise((r) => setTimeout(r, 600)); // stay under 2 req/s
        const userEntry = eligibleUsers[i];
        try {
          await sendWeeklyPaperDigestEmail(
            userEntry.email,
            userEntry.firstName,
            lang,
            summaries,
          );
          totalSent++;
        } catch (err) {
          console.error(`Failed to send email to ${userEntry.email}:`, err);
          const reason = err instanceof Error
            ? err.message
            : (typeof err === "object" ? JSON.stringify(err) : String(err));
          errors.push(`Email failed for user ${userEntry.id}: ${reason}`);
        }
      }

    }

    return NextResponse.json({
      success: true,
      sent: totalSent,
      summaries: summariesByLang,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Weekly paper digest cron error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 },
    );
  }
}
