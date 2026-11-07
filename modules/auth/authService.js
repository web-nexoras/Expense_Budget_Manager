
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("./authModel");

const {
  generateOTP,
  generateAccessToken,
  generateRefreshToken,
} = require("../../helpers/authUtils/auth_utils");

const { mailSender } = require("../../helpers/email/mailService");

const {
  redisSet,
  redisDelete,
  redisGet,
} = require("../../helpers/redisUtils/redis.utils");

// ----------- Signup Service
const signupService = async ({ name, email, phone, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw Object.assign(new Error("Email already registered"), {
      statusCode: 409,
    });
  }

  const otp = generateOTP();

  const user = await User.create({
    name,
    email,
    phone,
    password,
  });

  try {
    await redisSet(`otp:${email}`, otp, 300);
  } catch (err) {
    await User.deleteOne({ _id: user._id }).catch(console.error);
    throw Object.assign(new Error("Signup verification is temporarily unavailable"), {
      statusCode: 503,
    });
  }

  try {
    await mailSender({
      to: email,
      name,
      otp,
      purpose: "verify-email",
      expiresInMinutes: 5,
    });
  } catch (err) {
    console.error("Signup OTP email failed:", err.message);
    await redisDelete(`otp:${email}`).catch(console.error);
    await User.deleteOne({ _id: user._id }).catch(console.error);
    throw Object.assign(new Error("Failed to send OTP email"), { statusCode: 502 });
  }

  return {
    message:
      "Signup successful. Verify your email, then wait for admin approval before signing in.",
    email: user.email,
  };
};

// ----------- OTP Verify
const verifyOtpService = async ({ email, otp }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw Object.assign(new Error("No account found for this email"), {
      statusCode: 404,
    });
  }

  if (user.isVerified) {
    throw Object.assign(new Error("Email is already verified"), {
      statusCode: 409,
    });
  }

  // Get OTP From Redis
  const storedOtp = await redisGet(`otp:${email}`);

  if (!storedOtp) {
    throw Object.assign(
      new Error("OTP has expired. Please request a new one."),
      { statusCode: 400 }
    );
  }

  if (storedOtp !== otp) {
    throw Object.assign(new Error("Invalid OTP"), {
      statusCode: 400,
    });
  }

  user.isVerified = true;
  await user.save();

  // Delete Verified OTP
  await redisDelete(`otp:${email}`);

  return {
    message: "Email verified successfully.",
    email: user.email,
  };
};

// ----------- Resend OTP
const resendOtpService = async ({ email }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw Object.assign(new Error("No account found for this email"), {
      statusCode: 404,
    });
  }

  if (user.isVerified) {
    throw Object.assign(new Error("Email is already verified"), {
      statusCode: 409,
    });
  }

  const otp = generateOTP();

  try {
    // Store New OTP (5 Minutes)
    await redisSet(`otp:${email}`, otp, 300);

    await mailSender({
      to: user.email,
      name: user.name,
      otp,
      purpose: "verify-email",
      expiresInMinutes: 5,
    });
  } catch (err) {
    console.error("OTP resend delivery failed:", err.message);

    await redisDelete(`otp:${email}`).catch(console.error);

    throw Object.assign(new Error("Failed to send OTP email"), {
      statusCode: 500,
    });
  }

  return {
    message: "A new verification code has been sent.",
    email: user.email,
  };
};

// ----------- Forgot Password
const forgotPasswordService = async ({ email }) => {
  const user = await User.findOne({ email });

  if (!user || !user.isVerified || !user.isActive) {
    return {
      message:
        "If an eligible account exists, a password reset code has been sent.",
    };
  }

  const otp = generateOTP();

  try {
    // Store Reset OTP in Redis (5 Minutes)
    await redisSet(`resetOtp:${email}`, otp, 300);

    await mailSender({
      to: user.email,
      name: user.name,
      otp,
      purpose: "reset-password",
      expiresInMinutes: 5,
    });
  } catch (err) {
    console.error("Password reset email delivery failed:", err.message);

    await redisDelete(`resetOtp:${email}`).catch(console.error);

    throw Object.assign(new Error("Failed to send password reset email"), {
      statusCode: 500,
    });
  }

  return {
    message:
      "If an eligible account exists, a password reset code has been sent.",
  };
};

// ----------- Reset Password
const resetPasswordService = async ({ email, otp, newPassword }) => {
  const user = await User.findOne({ email });

  if (!user || !user.isVerified || !user.isActive) {
    throw Object.assign(
      new Error("Invalid or expired password reset code"),
      { statusCode: 400 }
    );
  }

  // Get Reset OTP From Redis
  const storedOtp = await redisGet(`resetOtp:${email}`);

  if (!storedOtp || storedOtp !== otp) {
    throw Object.assign(
      new Error("Invalid or expired password reset code"),
      { statusCode: 400 }
    );
  }

  user.password = newPassword;
  await user.save();

  // Delete Used Reset OTP
  await redisDelete(`resetOtp:${email}`);
  await redisDelete(`refreshToken:${user._id}`);

  return {
    message:
      "Password has been reset successfully. Please sign in with your new password.",
  };
};

// ----------- Signin Service
const signinService = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    throw Object.assign(new Error("Invalid email or password"), {
      statusCode: 401,
    });
  }

  if (!user.isVerified) {
    throw Object.assign(
      new Error("Please verify your email before signing in"),
      { statusCode: 403 }
    );
  }

  if (!user.isActive) {
    throw Object.assign(new Error("Your account has been deactivated."), {
      statusCode: 403,
    });
  }

  if (user.role === "user" && !user.isApproved) {
    throw Object.assign(
      new Error("Your account is waiting for admin approval."),
      { statusCode: 403 }
    );
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  await saveRefreshToken(user._id, refreshToken);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      currency: user.currency,
      role: user.role,
    },
  };
};

const saveRefreshToken = async (userId, refreshToken) => {
  const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
  await redisSet(`refreshToken:${userId}`, tokenHash, 15 * 24 * 60 * 60);
};

const refreshAuthService = async (refreshToken) => {
  if (!refreshToken) {
    throw Object.assign(new Error("Refresh token is missing"), { statusCode: 401 });
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_SEC);
  } catch (err) {
    throw Object.assign(new Error("Invalid or expired refresh token"), { statusCode: 401 });
  }

  const user = await User.findById(decoded._id);
  const savedTokenHash = user && await redisGet(`refreshToken:${user._id}`);
  const receivedTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

  const tokenMatches =
    typeof savedTokenHash === "string" &&
    savedTokenHash.length === receivedTokenHash.length &&
    crypto.timingSafeEqual(Buffer.from(savedTokenHash), Buffer.from(receivedTokenHash));

  if (!user || !user.isActive || !user.isVerified || !tokenMatches) {
    throw Object.assign(new Error("Invalid or expired refresh token"), { statusCode: 401 });
  }
  if (user.role === "user" && !user.isApproved) {
    throw Object.assign(new Error("Your account is waiting for admin approval."), { statusCode: 403 });
  }

  const accessToken = generateAccessToken(user);
  const nextRefreshToken = generateRefreshToken(user);
  await saveRefreshToken(user._id, nextRefreshToken);

  return { accessToken, refreshToken: nextRefreshToken };
};

const logoutService = async (refreshToken) => {
  if (!refreshToken) return;

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SEC);
    await redisDelete(`refreshToken:${decoded._id}`);
  } catch (err) {
    // An invalid token has no active Redis session to revoke.
  }
};

// ----------- Approve User
const approveUserService = async (userId) => {
  const user = await User.findOneAndUpdate(
    { _id: userId, role: "user" },
    { $set: { isApproved: true } },
    { new: true, runValidators: true }
  ).select("name email isApproved");

  if (!user) {
    throw Object.assign(new Error("User not found"), {
      statusCode: 404,
    });
  }

  return user;
};

module.exports = {
  signupService,
  verifyOtpService,
  resendOtpService,
  forgotPasswordService,
  resetPasswordService,
  signinService,
  refreshAuthService,
  logoutService,
  approveUserService,
};
