import fs from "fs";
import path from "path";

// テンプレートファイルを読み込んでプレースホルダーを置換する
const loadTemplate = (
  templateName: string,
  replacements: Record<string, string>
): string => {
  const templatePath = path.join(
    process.cwd(),
    "src/infra/email/templates",
    `${templateName}.html`
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
