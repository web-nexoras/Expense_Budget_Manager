const express = require("express");
const { signup, verifyOtp, resendOtp } = require("./authController");
const { signupSchema, verifyOtpSchema, resendOtpSchema } = require("./authValidations");
const validateRequest = require("../../middlewares/validationRequest");
const { authRateLimiter, otpRateLimiter } = require("../../middlewares/rateLimiter");

const router = express.Router();

router.post("/signup", authRateLimiter, validateRequest(signupSchema), signup);
router.post("/verify-otp", otpRateLimiter, validateRequest(verifyOtpSchema), verifyOtp);
router.post("/resend-otp", otpRateLimiter, validateRequest(resendOtpSchema), resendOtp);

module.exports = router;
