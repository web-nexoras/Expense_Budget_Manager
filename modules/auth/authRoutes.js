const express = require("express");
const { signup, resendOtp } = require("./authController");
const { signupSchema, resendOtpSchema } = require("./authValidations");
const validateRequest = require("../../middlewares/validationRequest");
const { authRateLimiter, otpRateLimiter } = require("../../middlewares/rateLimiter");

const router = express.Router();

router.post("/signup", authRateLimiter, validateRequest(signupSchema), signup);
router.post("/resend-otp", otpRateLimiter, validateRequest(resendOtpSchema), resendOtp);

module.exports = router;
