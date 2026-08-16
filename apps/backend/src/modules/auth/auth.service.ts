import { env } from "../../config/env";
import { AppError } from "../../errors/AppError";
import { googleOAuth2Client } from "../../lib/google";
import { setAuthCookie } from "../../utils/cookie";
import { generateAccessToken } from "../../utils/jwt";
import { comparePassword, hashPassword } from "../../utils/password";
import {
  generateRefreshToken,
  hashRefreshToken,
} from "../../utils/refreshToken";
import { AuthRepository } from "./auth.repository";
import type { SignupInput,SigninInput } from "shared";
export class AuthService {
  constructor(private readonly authRepositoty: AuthRepository) {}
  async signup(data: SignupInput) {
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
    const refreshTokenHash = hashRefreshToken(refreshToken);
    await this.authRepositoty.updateRefreshToken(userId, refreshTokenHash);
    return {
      accessToken,
      refreshToken,
    };
  }
  async signin(data: SigninInput) {
    const user = await this.authRepositoty.findUserByEmail(data.email)
    if (!user) {
      throw new AppError("Email or password is incorrect",400)
    }
    if (!user.passwordHash) {
      throw new AppError("Account is connected with other login method like ,google",401)
    }
    // check the password
    const isPasswordCorrect = await comparePassword(data.password, user.passwordHash) 
    if (!isPasswordCorrect) {
      throw new AppError("Email or password is incorrect",400)
    }
    // create the session 
    const { accessToken, refreshToken } = await this.createSession(user.id)
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email:user.email,
      }
    }
  }
  async refresh(refreshToken: string) {
    const refreshTokenHash = hashRefreshToken(refreshToken)
    const user = await this.authRepositoty.findUserByRefreshToken(refreshTokenHash)
    if (!user) {
      throw new AppError("Invalid refreshToken",401)
    }
    const { accessToken, refreshToken: newrefreshToken } = await this.createSession(user.id)
    return {
      accessToken,
      refreshToken:newrefreshToken
    }
  }
  async signout(refreshToken: string) {
    const refreshTokenHash = hashRefreshToken(refreshToken)
    const user = await this.authRepositoty.findUserByRefreshToken(refreshTokenHash)
    if (!user) {
      throw new AppError("Invalid Token",401)
    }
    await this.authRepositoty.clearRefreshToken(user.id)
  }
  async getMe(id: string) {
    const user = await this.authRepositoty.findUserById(id)
    if (!user) {
      throw new AppError("User not found")
    }
    return {
      name: user.name,
      email: user.email,
      id:user.id,
    }
  }
}
