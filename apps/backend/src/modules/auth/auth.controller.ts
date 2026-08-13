import { Request, Response } from "express";
import { AuthService } from "./auth.service";

export class AuthController {
  constructor(private readonly authService: AuthService) {}
  signup = async (req: Request, res: Response) => {
    const user = await this.authService.singup(req.body);
    res.status(200).json({
      success: true,
      data: user,
    });
  };
  google = async (req: Request, res: Response) => {
    const url = this.authService.getGoogleOAuthUrl()
    return res.redirect(url)
  }
}
