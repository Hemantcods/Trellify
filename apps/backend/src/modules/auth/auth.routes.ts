import { Router } from "express";
import { validate } from "../../middleware/validate.middleware";
import { googleCallbackSchema, SigninSchema, signupSchema } from "shared";
import { asyncHandler } from "../../utils/asyncHandler";
import { authController } from "./auth.container";

const router = Router();

router.post(
  "/signup",
  validate(signupSchema),
  asyncHandler(authController.signup),
);
router.post(
  "/signin",
  validate(SigninSchema),
  asyncHandler(authController.signin),
);
router.get(
  "/google/callback",
  validate(googleCallbackSchema, "query"),
  asyncHandler(authController.googleCallback),
);
router.get("/google", asyncHandler(authController.google));
export default router;
