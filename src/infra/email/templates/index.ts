import fs from "fs";
import path from "path";
import type { PaperSummary } from "@/lib/ai/common";

const escapeHtml = (str: unknown): string => {
  const s = typeof str === "string" ? str : String(str ?? "");
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
};

// テンプレートファイルを読み込んでプレースホルダーを置換する
const loadTemplate = (
  templateName: string,
  replacements: Record<string, string>,
): string => {
  const templatePath = path.join(
    process.cwd(),
    "src/infra/email/templates",
    `${templateName}.html`,
  );
  let html = fs.readFileSync(templatePath, "utf-8");

  // {{key}} 形式のプレースホルダーを置換
  Object.entries(replacements).forEach(([key, value]) => {
    html = html.replace(new RegExp(`{{${key}}}`, "g"), value);
  });

  return html;
};

type PasswordResetParams = {
  resetLink: string;
};

export const passwordResetTemplate = ({ resetLink }: PasswordResetParams) => ({
  subject: "パスワードリセットのご案内",
  html: loadTemplate("passwordReset", { resetLink }),
});

type WeeklyPaperDigestParams = {
  firstName: string;
  language: string;
  papers: PaperSummary[];
};

const DIGEST_LABELS: Record<string, Record<string, string>> = {
  ja: {
    subject: "【週刊】瞑想研究ダイジェスト",
    headline: "今週の瞑想研究",
    subheadline: "最新の科学的知見をお届けします",
    greeting: "こんにちは、{{firstName}}さん。",
    intro: "今週も最新の瞑想・マインドフルネス研究をまとめてお届けします。科学的根拠に基づいた実践に役立ててください。",
    readMore: "PubMedで詳細を読む",
    footerText: "このメールはmedimate appからの週次ニュースレターです。",
    authors: "著者",
    journal: "掲載誌",
    published: "掲載日",
  },
  en: {
    subject: "Weekly Meditation Research Digest",
    headline: "This Week in Meditation Research",
    subheadline: "Bringing you the latest scientific insights",
    greeting: "Hello, {{firstName}}.",
    intro: "Here are this week's latest meditation and mindfulness research highlights. Use these evidence-based insights to enhance your practice.",
    readMore: "Read full paper on PubMed",
    footerText: "This email is the weekly newsletter from medimate app.",
    authors: "Authors",
    journal: "Journal",
    published: "Published",
  },
  es: {
    subject: "Resumen Semanal de Investigación sobre Meditación",
    headline: "Investigación sobre Meditación esta Semana",
    subheadline: "Las últimas perspectivas científicas para usted",
    greeting: "Hola, {{firstName}}.",
    intro: "Aquí están los últimos hallazgos de investigación sobre meditación y mindfulness de esta semana. Utilice estas perspectivas basadas en evidencia para mejorar su práctica.",
    readMore: "Leer el artículo completo en PubMed",
    footerText: "Este correo es el boletín semanal de medimate app.",
    authors: "Autores",
    journal: "Revista",
    published: "Publicado",
  },
};

const buildPapersHtml = (
  papers: PaperSummary[],
  labels: Record<string, string>,
): string => {
  return papers
    .map(
      (paper, index) => `
    <tr>
      <td style="padding: ${index === 0 ? "32px" : "16px"} 40px 0">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
          style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          <tr>
            <td style="padding: 24px">
              <p style="margin: 0 0 4px; font-size: 11px; font-weight: 600; color: #7c3aed; text-transform: uppercase; letter-spacing: 1px;">
                No.${index + 1}
              </p>
              <h2 style="margin: 0 0 12px; font-size: 17px; font-weight: 700; color: #111827; line-height: 1.4;">
                ${escapeHtml(paper.title)}
              </h2>
              <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.7; color: #4b5563;">
                ${escapeHtml(paper.summary)}
              </p>
              <table role="presentation" cellspacing="0" cellpadding="0" style="border-top: 1px solid #f3f4f6; padding-top: 12px; width: 100%;">
                <tr>
                  <td style="font-size: 12px; color: #9ca3af;">
                    ${paper.authors.length > 0 ? `<span style="font-weight: 600; color: #6b7280;">${escapeHtml(labels.authors)}:</span> ${paper.authors.map(escapeHtml).join(", ")}` : ""}
                    ${paper.authors.length > 0 ? " &nbsp;|&nbsp; " : ""}
                    <span style="font-weight: 600; color: #6b7280;">${escapeHtml(labels.journal)}:</span> ${escapeHtml(paper.journal)}
                    &nbsp;|&nbsp;
                    <span style="font-weight: 600; color: #6b7280;">${escapeHtml(labels.published)}:</span> ${escapeHtml(paper.pubDate)}
                  </td>
                  <td style="text-align: right; white-space: nowrap; padding-left: 12px;">
                    <a href="https://pubmed.ncbi.nlm.nih.gov/${paper.id}/"
                      style="font-size: 12px; color: #4f46e5; text-decoration: none; font-weight: 600;">
                      ${labels.readMore} →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>`,
    )
    .join("\n");
};

export const weeklyPaperDigestTemplate = ({
  firstName,
  language,
  papers,
}: WeeklyPaperDigestParams) => {
  const lang = DIGEST_LABELS[language] ? language : "ja";
  const labels = DIGEST_LABELS[lang];

  const papersHtml = buildPapersHtml(papers, labels);

  const html = loadTemplate("weeklyPaperDigest", {
    lang,
    headline: labels.headline,
    subheadline: labels.subheadline,
    greeting: labels.greeting.replace("{{firstName}}", escapeHtml(firstName)),
    intro: labels.intro,
    papers: papersHtml,
    footerText: labels.footerText,
  });

  return { subject: labels.subject, html };
};
