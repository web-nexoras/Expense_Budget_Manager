
const User = require("./authModel");
const { generateOTP } = require("../../helpers/authUtils/auth_utils");
const { mailSender } = require("../../helpers/email/mailService");

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
    otp,
    otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
  });

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
    // Do not leave an unusable, unverified account behind when email delivery fails.
    await User.deleteOne({ _id: user._id }).catch((cleanupError) => {
      console.error("Could not roll back signup after email failure:", cleanupError.message);
    });
    throw Object.assign(new Error("Failed to send OTP email"), {
      statusCode: 500,
    });
  }

  return {
    message: "Registration successful. Please verify your email.",
    email: user.email,
  };
};

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
    throw Object.assign(new Error("Failed to send OTP email"), {
      statusCode: 500,
    });
  }

  return { message: "A new verification code has been sent.", email: user.email };
};

module.exports = {
  signupService,
  resendOtpService,
};
