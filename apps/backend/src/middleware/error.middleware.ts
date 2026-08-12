import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/AppError";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // Zod validation error
  if (error instanceof ZodError) {
    return res.status(200).json({
      success: false,
      message: "Validation Failed",
      errors: error.flatten(),
    });
  }
  // App errors
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      errors: error.message,
    });
  }
  // Unknown/unexpected errors
  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
