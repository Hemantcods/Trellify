import { env } from "../../config/env.js";
import { transporter } from "./transporter.js";

interface sendEmailProps {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: sendEmailProps) => {
  await transporter.sendMail({
    from: `"Trellify" <${env.SMTP_EMAIL}>`,
    to,
    subject,
    html,
  });
};