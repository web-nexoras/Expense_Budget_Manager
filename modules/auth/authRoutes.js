const express = require("express");
const { signup } = require("./authController");
const { signupSchema } = require("./authValidations");
const validateRequest = require("../../middlewares/validationRequest");
const { authRateLimiter } = require("../../middlewares/rateLimiter");

const router = express.Router();

router.post("/signup", authRateLimiter, validateRequest(signupSchema), signup);

module.exports = router;
