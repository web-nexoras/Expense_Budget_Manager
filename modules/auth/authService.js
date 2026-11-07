
const User = require("./authModel");
const {
  generateOTP,
  generateAccessToken,
  generateRefreshToken,
} = require("../../helpers/authUtils/auth_utils");
const { mailSender } = require("../../helpers/email/mailService");
const { redisSet, redisDelete } = require("../../helpers/redisUtils/redis.utils");

// ----------- Signup Service
const signupService = async ({ name, email, phone, password }) => {

  // Check Existing User
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw Object.assign(new Error("Email already registered"), {
      statusCode: 409,
    });
  }

  // Generate OTP
  const otp = generateOTP();

  // Create New User
  const user = await User.create({
    name,
    email,
    phone,
    password,
  });

  // Store OTP in Redis (5 Minutes)
  await redisSet(`otp:${email}`, otp, 300); 

  // Send OTP Email
  try {
    await mailSender({
      to: email,
      name,
      otp,
      purpose: "verify-email",
      expiresInMinutes: 5,
    });
  } catch (err) {
    console.error("OTP email delivery failed:", err.message);

    // Delete OTP from Redis
    await redisDelete(`otp:${email}`).catch(console.error);

    // Rollback User Creation
    await User.deleteOne({ _id: user._id }).catch(console.error);

    throw Object.assign(new Error("Failed to send OTP email"), {
      statusCode: 500,
    });
  }

  return {
    message: "Signup successful. Verify your email, then wait for admin approval before signing in.",
    email: user.email,
  };
};

// ---------otp verify
const verifyOtpService = async ({ email, otp }) => {
  const user = await User.findOne({ email }).select("+otp +otpExpiry");

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

  if (!user.otp || !user.otpExpiry || user.otpExpiry <= new Date()) {
    throw Object.assign(new Error("OTP has expired. Please request a new one."), {
      statusCode: 400,
    });
  }

  if (user.otp !== otp) {
    throw Object.assign(new Error("Invalid OTP"), { statusCode: 400 });
  }

  user.isVerified = true;
  user.otp = "";
  user.otpExpiry = null;
  await user.save();

  return { message: "Email verified successfully.", email: user.email };
};


// ----------resend otp 
const resendOtpService = async ({ email }) => {
  const user = await User.findOne({ email }).select("+otp +otpExpiry");

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
  const previousOtp = user.otp;
  const previousOtpExpiry = user.otpExpiry;
  user.otp = otp;
  user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();

  try {
    await mailSender({
      to: user.email,
      name: user.name,
      otp,
      purpose: "verify-email",
      expiresInMinutes: 5,
    });
  } catch (err) {
    console.error("OTP resend delivery failed:", err.message);
    user.otp = previousOtp;
    user.otpExpiry = previousOtpExpiry;
    await user.save().catch((restoreError) => {
      console.error("Could not restore previous OTP:", restoreError.message);
    });
    throw Object.assign(new Error("Failed to send OTP email"), {
      statusCode: 500,
    });
  }

  return { message: "A new verification code has been sent.", email: user.email };
};

const forgotPasswordService = async ({ email }) => {
  const user = await User.findOne({ email }).select("+resetPasswordToken +resetPasswordExpiry");

  // Keep the response identical for known and unknown addresses to prevent account discovery.
  if (!user || !user.isVerified || !user.isActive) {
    return { message: "If an eligible account exists, a password reset code has been sent." };
  }

  const otp = generateOTP();
  const previousToken = user.resetPasswordToken;
  const previousExpiry = user.resetPasswordExpiry;
  user.resetPasswordToken = otp;
  user.resetPasswordExpiry = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();

  try {
    await mailSender({
      to: user.email,
      name: user.name,
      otp,
      purpose: "reset-password",
      expiresInMinutes: 5,
    });
  } catch (err) {
    console.error("Password reset email delivery failed:", err.message);
    user.resetPasswordToken = previousToken;
    user.resetPasswordExpiry = previousExpiry;
    await user.save().catch((restoreError) => {
      console.error("Could not restore previous password reset code:", restoreError.message);
    });
    throw Object.assign(new Error("Failed to send password reset email"), { statusCode: 500 });
  }

  return { message: "If an eligible account exists, a password reset code has been sent." };
};

const resetPasswordService = async ({ email, otp, newPassword }) => {
  const user = await User.findOne({ email }).select("+password +resetPasswordToken +resetPasswordExpiry");
  if (!user || !user.resetPasswordToken || !user.resetPasswordExpiry || user.resetPasswordExpiry <= new Date()) {
    throw Object.assign(new Error("Invalid or expired password reset code"), { statusCode: 400 });
  }
  if (user.resetPasswordToken !== otp) {
    throw Object.assign(new Error("Invalid or expired password reset code"), { statusCode: 400 });
  }

  user.password = newPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpiry = null;
  await user.save();
  return { message: "Password has been reset successfully. Please sign in with your new password." };
};

const signinService = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    throw Object.assign(new Error("Invalid email or password"), { statusCode: 401 });
  }

  if (!user.isVerified) {
    throw Object.assign(new Error("Please verify your email before signing in"), { statusCode: 403 });
  }

  if (!user.isActive) {
    throw Object.assign(new Error("Your account has been deactivated."), { statusCode: 403 });
  }

  if (user.role === "user" && !user.isApproved) {
    throw Object.assign(new Error("Your account is waiting for admin approval."), { statusCode: 403 });
  }

  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user),
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

const approveUserService = async (userId) => {
  const user = await User.findOneAndUpdate(
    { _id: userId, role: "user" },
    { $set: { isApproved: true } },
    { new: true, runValidators: true }
  ).select("name email isApproved");

  if (!user) {
    throw Object.assign(new Error("User not found"), { statusCode: 404 });
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
  approveUserService,
};
