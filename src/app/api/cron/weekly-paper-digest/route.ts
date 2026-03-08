import { NextRequest, NextResponse } from "next/server";
import config from "@/config";
import { list } from "@/models/user/list";
import { getAdminAuth } from "@/lib/firebaseAdmin";
import { fetchRecentMeditationPapers } from "@/infra/papers";
import { summarizePapersForLanguage } from "@/lib/anthropic";
import { sendWeeklyPaperDigestEmail } from "@/infra/email";

export const maxDuration = 300; // 5 minutes

export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${config.CRON_SECRET}`) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch all active users
    const users = await list();
    const activeUsers = users.filter((u) => u.status === "active");

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
      acc[lang].push({
        id: user.id,
        firstName: user.first_name,
        email: "",
      });
      return acc;
    }, {});

    // Fetch emails from Firebase Auth
    for (const lang of Object.keys(usersByLanguage)) {
      for (const userEntry of usersByLanguage[lang]) {
        try {
          const authUser = await adminAuth.getUser(userEntry.id);
          userEntry.email = authUser.email ?? "";
        } catch (err) {
          console.error(`Failed to get email for user ${userEntry.id}:`, err);
        }
      }
    }

    let totalSent = 0;
    const errors: string[] = [];

    // For each language, summarize papers and send emails
    for (const [lang, langUsers] of Object.entries(usersByLanguage)) {
      let summaries;
      try {
        summaries = await summarizePapersForLanguage(papers, lang);
      } catch (err) {
        console.error(`Failed to summarize papers for language ${lang}:`, err);
        errors.push(`Summarization failed for ${lang}`);
        continue;
      }

      for (const userEntry of langUsers) {
        if (!userEntry.email) continue;
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
          errors.push(`Email failed for user ${userEntry.id}`);
        }
      }
    }

    return NextResponse.json({
      success: true,
      sent: totalSent,
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
