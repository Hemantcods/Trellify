import { env } from "../../config/env";
import { AppError } from "../../errors/AppError";
import { googleOAuth2Client } from "../../lib/google";
import { generateAccessToken } from "../../utils/jwt";
import { hashPassword } from "../../utils/password";
import {
  generateRefreshToken,
  hashRefrehToken,
} from "../../utils/refreshToken";
import { AuthRepository } from "./auth.repository";
import type { SignupInput } from "shared";
export class AuthService {
  constructor(private readonly authRepositoty: AuthRepository) {}
  async singup(data: SignupInput) {
    const { name, email, password } = data;
    const existingUser = await this.authRepositoty.findUserByEmail(email);
    if (existingUser) {
      throw new AppError("User Already Exists", 404);
    }
    const passwordHash = await hashPassword(password);
    const user = await this.authRepositoty.createUser({
      name,
      email,
      passwordHash,
    });
    return {
      user,
    };
  }
  // google OAuth ur genraton function
  getGoogleOAuthUrl() {
    return googleOAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["openid", "email", "profile"],
      prompt: "select_account",
    });
  }
  // google redirect back with a code
  async googleCallback(code: string) {
    const { tokens } = await googleOAuth2Client.getToken(code);
    if (!tokens.id_token) {
      throw new AppError("Google Authentication failed", 401);
    }
    // create ticket
    const ticket = await googleOAuth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload) {
      throw new AppError("Invalid google Account");
    }
    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name;
    // checks for info
    if (!email || !name || !googleId) {
      throw new AppError("Google Account Information is incomplete", 400);
    }
    if (payload.email_verified !== true) {
      throw new AppError("Google email is not verified", 401);
    }
    let user = await this.authRepositoty.findUserByGoogleId(googleId);

    if (!user) {
      user = await this.authRepositoty.findUserByEmail(email);
    }
    // Existing Account
    if (user) {
      if (!user.googleId) {
        user = await this.authRepositoty.linkGoogleAccount(user.id, googleId);
      }
    } else {
      user = await this.authRepositoty.createGoogleUser({
        name,
        email,
        googleId,
      });
    }
    const {accessToken,refreshToken}=await this.createSession(user.id)
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
  private async createSession(userId: string) {
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken();
    const refreshTokenHash = hashRefrehToken(refreshToken);
    await this.authRepositoty.updateRefrehToken(userId, refreshTokenHash);
    return {
      accessToken,
      refreshToken,
    };
  }
  
}
