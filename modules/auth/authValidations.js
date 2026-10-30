const { z } = require("zod");

// Common Auth User Schema
const authUserSchema = {
  name: z
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name cannot exceed 50 characters"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .email("Invalid email address"),

  // Bangladeshi mobile number (e.g. 01712345678, +8801712345678)
  phone: z
    .string()
    .trim()
    .regex(/^(?:\+?88)?01[3-9]\d{8}$/, "Invalid Bangladeshi phone number"),

  // bcrypt reads at most 72 BYTES, so check bytes instead of characters
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .refine(
      (v) => Buffer.byteLength(v, "utf8") <= 72,
      "Password is too long (max 72 bytes)"
    ),

  // Must match the length produced by generateOTP() (4 digits)
  otp: z
    .string()
    .trim()
    .regex(/^\d{4}$/, "OTP must be exactly 4 digits"),
};

// 1. Signup
const signupSchema = z.object({
  body: z
    .object({
      name: authUserSchema.name,
      email: authUserSchema.email,
      phone: authUserSchema.phone,
      password: authUserSchema.password,
    })
    .strict(),
});

// 2. Verify OTP
const verifyOtpSchema = z.object({
  body: z
    .object({
      email: authUserSchema.email,
      otp: authUserSchema.otp,
    })
    .strict(),
});

// 3. Resend OTP
const resendOtpSchema = z.object({
  body: z
    .object({
      email: authUserSchema.email,
    })
    .strict(),
});

// 4. Signin
const signinSchema = z.object({
  body: z
    .object({
      email: authUserSchema.email,
      password: z.string().min(1, "Password is required"),
    })
    .strict(),
});

// 5. Forgot Password
const forgotPasswordSchema = z.object({
  body: z
    .object({
      email: authUserSchema.email,
    })
    .strict(),
});

// 6. Reset Password
const resetPasswordSchema = z.object({
  body: z
    .object({
      email: authUserSchema.email,
      otp: authUserSchema.otp,
      newPassword: authUserSchema.password,
    })
    .strict(),
});

// 7. Change Password
const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z.string().min(1, "Current password is required"),
      newPassword: authUserSchema.password,
    })
    .strict()
    .refine((d) => d.currentPassword !== d.newPassword, {
      message: "New password must be different from current password",
      path: ["newPassword"],
    }),
});

module.exports = {
  authUserSchema,
  signupSchema,
  verifyOtpSchema,
  resendOtpSchema,
  signinSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
};
