const { asyncHandler } = require("../../middlewares/asyncHandler");
const { sendResponse } = require("../../middlewares/sendResponse");
const authService = require("./authService");

const setAuthCookies = (res, { accessToken, refreshToken }) => {
  const isProduction = process.env.NODE_ENV === "production";
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  };

  res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 15 * 24 * 60 * 60 * 1000 });
};

// -------- Signup
const signup = asyncHandler(async (req, res) => {
  const data = await authService.signupService(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: data.message,
    data: { email: data.email },
  });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const data = await authService.verifyOtpService(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: data.message,
    data: { email: data.email },
  });
});

const resendOtp = asyncHandler(async (req, res) => {
  const data = await authService.resendOtpService(req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: data.message,
    data: { email: data.email },
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const data = await authService.forgotPasswordService(req.body);
  sendResponse(res, { statusCode: 200, success: true, message: data.message });
});

const resetPassword = asyncHandler(async (req, res) => {
  const data = await authService.resetPasswordService(req.body);
  sendResponse(res, { statusCode: 200, success: true, message: data.message });
});

const signin = asyncHandler(async (req, res) => {
  const data = await authService.signinService(req.body);
  setAuthCookies(res, data);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Signed in successfully.",
    data: { user: data.user },
  });
});

const approveUser = asyncHandler(async (req, res) => {
  const user = await authService.approveUserService(req.params.userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User approved successfully.",
    data: { user },
  });
});

module.exports = { signup, verifyOtp, resendOtp, forgotPassword, resetPassword, signin, approveUser };
