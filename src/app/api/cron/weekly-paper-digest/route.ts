// presentation
import { NextRequest, NextResponse } from "next/server";
// service
import { groupUsersByLanguage, processLanguages } from "./service";
// repository
import { list } from "@/models/user/list";
import { fetchRecentMeditationPapers } from "@/infra/papers";
import { fillEmailsFromAuth } from "@/repository/userRepository";
// config
import config from "@/config";

export const maxDuration = 300; // 5 minutes

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
    const allUsers = await fillEmailsFromAuth(Object.values(usersByLanguage).flat());
    const emailMap = new Map(allUsers.map((u) => [u.id, u.email]));
    const usersByLanguageWithEmail = Object.fromEntries(
      Object.entries(usersByLanguage).map(([lang, users]) => [
        lang,
        users.map((u) => ({ ...u, email: emailMap.get(u.id) ?? "" })),
      ]),
    );

    const { totalSent, allErrors, summariesByLang } = await processLanguages(usersByLanguageWithEmail, papers);

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
