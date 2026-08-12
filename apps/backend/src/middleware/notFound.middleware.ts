import type {
  NextFunction,
  Request,
  Response,
} from "express";

import { AppError } from "../errors/AppError.js";

export const notFoundHandler = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  next(
    new AppError(
      `Route ${req.method} ${req.originalUrl} not found`,
      404,
    ),
  );
};