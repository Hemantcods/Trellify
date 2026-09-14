import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { clearAuthCookie, setAuthCookie } from "../../utils/cookie";
import { env } from "../../config/env";
import { GoogleCallbackInput } from "shared";
import { AppError } from "../../errors/AppError";
import { AuthRequest } from "../../middleware/auth.middleware";

export class AuthController {
  constructor(private readonly authService: AuthService) {}
  signup = async (req: Request, res: Response) => {
    const user = await this.authService.signup(req.body);
    res.status(200).json({
      success: true,
      data: user,
    });
  };
  signin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await this.authService.signin({
      email,
      password,
    });
    setAuthCookie(res, accessToken, refreshToken);
    res.status(200).json({
      success: true,
      message: "Signin Successfull",
    });
  };
  google = async (_req: Request, res: Response) => {
    const url = this.authService.getGoogleOAuthUrl();
    return res.redirect(url);
  };
  googleCallback = async (req: Request, res: Response) => {
    const { code } = req.query as GoogleCallbackInput;
    console.log(code);
    const { accessToken, refreshToken } = await this.authService.googleCallback(
      code as string,
    );
    setAuthCookie(res, accessToken, refreshToken);
    return res.redirect(`${env.FRONTEND_URL}/oauth/success`);
  };
  refresh = async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new AppError("Refresh token is required", 401);
    }
    const { accessToken, refreshToken: newRefreshToken } =
      await this.authService.refresh(refreshToken);
    setAuthCookie(res, accessToken, newRefreshToken);
    res.status(200).json({
      success: true,
      message: "Token refreshed Successfully",
    });
  };
  signout = async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await this.authService.signout(refreshToken);
    }
    clearAuthCookie(res);
    res.status(200).json({
      success: true,
      message: "Signout Successfull",
    });
  };
  me = async (req: AuthRequest, res: Response) => {
    const { id } = req.user!;
    const data = await this.authService.getMe(id);
    res.status(200).json({
      success: true,
      data,
    });
  };
}
