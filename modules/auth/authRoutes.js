const express = require("express");
const { signup, verifyOtp, resendOtp, signin, approveUser, forgotPassword, resetPassword } = require("./authController");
const { signupSchema, verifyOtpSchema, resendOtpSchema, signinSchema, forgotPasswordSchema, resetPasswordSchema } = require("./authValidations");
const validateRequest = require("../../middlewares/validationRequest");
const { authRateLimiter, otpRateLimiter } = require("../../middlewares/rateLimiter");
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { requireAdmin } = require("../../middlewares/requireAdmin");

const router = express.Router();

router.post("/signup", authRateLimiter, validateRequest(signupSchema), signup);
router.post("/signin", authRateLimiter, validateRequest(signinSchema), signin);
router.patch("/users/:userId/approve", authMiddleware, requireAdmin, approveUser);
router.post("/verify-otp", otpRateLimiter, validateRequest(verifyOtpSchema), verifyOtp);
router.post("/resend-otp", otpRateLimiter, validateRequest(resendOtpSchema), resendOtp);
router.post("/forgot-password", otpRateLimiter, validateRequest(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", otpRateLimiter, validateRequest(resetPasswordSchema), resetPassword);

module.exports = router;
