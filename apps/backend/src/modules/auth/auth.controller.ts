import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { setAuthCookie } from "../../utils/cookie";
import { env } from "../../config/env";
import { GoogleCallbackInput } from "shared";

export class AuthController {
  constructor(private readonly authService: AuthService) {}
  signup = async (req: Request, res: Response) => {
    const user = await this.authService.singup(req.body);
    res.status(200).json({
      success: true,
      data: user,
    });
  };
  google = async (_req: Request, res: Response) => {
    const url = this.authService.getGoogleOAuthUrl()
    return res.redirect(url)
  }
  googleCallback = async (req: Request, res: Response) => {
    const { code } = req.query as GoogleCallbackInput
    console.log(code)
    const { accessToken,refreshToken} = await this.authService.googleCallback(code as string)
    setAuthCookie(res, accessToken, refreshToken)
    return res.redirect(`${env.FRONTEND_URL}/dashboard`)
  }
}
