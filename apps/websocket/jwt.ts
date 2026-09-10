import jwt from "jsonwebtoken";
import { env } from "./env";

export type AccessTokenPayload = {
  userId: string;
};
export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
};
