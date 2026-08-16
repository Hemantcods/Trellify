import { Router } from "express";
import { validate } from "../../middleware/validate.middleware";
import { googleCallbackSchema, SigninSchema, signupSchema } from "shared";
import { asyncHandler } from "../../utils/asyncHandler";
import { authController } from "./auth.container";
import { requireAuth } from "../../middleware/auth.middleware";

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
router.post("/refresh", asyncHandler(authController.refresh));
router.post("/signout", asyncHandler(authController.signout));
router.post("/me",requireAuth,asyncHandler(authController.me))
export default router;
