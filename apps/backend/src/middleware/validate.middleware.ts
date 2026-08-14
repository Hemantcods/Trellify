import { NextFunction, Request, RequestHandler, Response } from "express";
import { ZodType } from "zod";

type RequestPart = "body" | "params" | "query";
export const validate = (
  schema: ZodType,
  part: RequestPart = "body",
): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[part]);
    if (!result.success) {
      return next(result.error);
    }
    next();
  };
};
