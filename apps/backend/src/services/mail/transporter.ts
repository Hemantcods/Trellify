import nodemailer from "nodemailer";
import { env } from "../../config/env";
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.SMTP_EMAIL,
    pass: env.SMTP_PASSWORD,
  },
});
