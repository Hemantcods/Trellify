import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce.number().default(5000),

  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),

  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  FRONTEND_URL: z.string().min(1, "FRONTEND_URL is required in the env"),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CALLBACK_URL: z.string(),
  SMTP_PASSWORD: z.string(),
  SMTP_EMAIL: z.string(),
  APP_NAME:z.string(),
});

export const env = envSchema.parse(process.env);
