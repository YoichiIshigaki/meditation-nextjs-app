import { Resend } from "resend";
import config from "@/config";

console.log("config.RESEND_API_KEY", config.RESEND_API_KEY);

const resend = new Resend(config.RESEND_API_KEY);

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

export const sendEmail = async ({ to, subject, html }: SendEmailParams) => {
  const { data, error } = await resend.emails.send({
    from: config.EMAIL_FROM,
    to,
    subject,
    html,
  });

  if (error) {
    console.error("Email sending error:", error);
    throw error;
  }

  return data;
};

export const sendPasswordResetEmail = async (email: string, resetLink: string) => {
  const subject = "パスワードリセットのご案内";
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>パスワードリセット</h2>
      <p>パスワードリセットのリクエストを受け付けました。</p>
      <p>以下のリンクをクリックして、新しいパスワードを設定してください。</p>
      <p style="margin: 24px 0;">
        <a href="${resetLink}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
          パスワードをリセット
        </a>
      </p>
      <p style="color: #666; font-size: 14px;">
        このリンクは1時間後に無効になります。<br>
        このメールに心当たりがない場合は、無視してください。
      </p>
    </div>
  `;

  return sendEmail({ to: email, subject, html });
};
