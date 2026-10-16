const express = require("express");
const router = express.Router();

const { signup, verifyOtp, resendOtp, signin, forgotPassword, resetPassword } = require("../../controllers/auth/authControllers");
const { logOut, getProfile, updateProfile } = require("../../controllers/auth/authControllers");
const { authMiddleware } = require("../../middlewares/authMiddleware");
const { checkActive } = require("../../middlewares/checkActive");
const { authRateLimiter } = require("../../middlewares/rateLimiter");

// Public
router.post("/signup", authRateLimiter, signup);
router.post("/verify-otp", authRateLimiter, verifyOtp);
router.post("/resend-otp", authRateLimiter, resendOtp);
router.post("/signin", authRateLimiter, signin);
router.post("/forgot-password", authRateLimiter, forgotPassword);
router.patch("/reset-password/:token", authRateLimiter, resetPassword);

// Protected
router.use(authMiddleware, checkActive);
router.post("/log-out", logOut);
router.get("/me", getProfile);
router.put("/me", updateProfile);

module.exports = router;
