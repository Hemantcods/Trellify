import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { verifyAccessToken } from "../utils/jwt";

export interface AuthRequest extends Request {
  user: {
    id: string;
  };
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.accesstoken;
    if (!token) {
      throw new AppError("Authentication required", 401);
    }
    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.userId,
    };
    next();
  } catch (error) {
    next(error);
  }
};
