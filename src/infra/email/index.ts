import { Resend } from "resend";
import config from "@/config";
import { passwordResetTemplate } from "./templates";

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
  const { subject, html } = passwordResetTemplate({ resetLink });
  return sendEmail({ to: email, subject, html });
};
