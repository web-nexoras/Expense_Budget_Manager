
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
    throw Object.assign(new Error("Failed to send OTP email"), {
      statusCode: 500,
    });
  }

  return {
    message: "Registration successful. Please verify your email.",
    email: user.email,
  };
};

module.exports = {
  signupService,
};
