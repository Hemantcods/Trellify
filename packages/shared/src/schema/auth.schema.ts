import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(8),
});

export type SignupInput = z.infer<typeof signupSchema>;

export const signinSchema = z.object({
  email: z.email(),
  password:z.string().min(8)
})

export type SigninInput = z.infer<typeof signinSchema>

export const googleCallbackSchema = z.object({
  code:z.string().min(1,"Google Authorisation code is required")
})
export type  GoogleCallbackInput=z.infer<typeof googleCallbackSchema>