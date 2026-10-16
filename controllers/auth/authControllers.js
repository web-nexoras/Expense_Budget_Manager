const { asyncHandler } = require("../../middlewares/asyncHandler");

const notImplemented = (req, res) => res.status(501).json({ success: false, message: "Controller not implemented yet" });

const signup = asyncHandler(async (req, res) => notImplemented(req, res));
const verifyOtp = asyncHandler(async (req, res) => notImplemented(req, res));
const resendOtp = asyncHandler(async (req, res) => notImplemented(req, res));
const signin = asyncHandler(async (req, res) => notImplemented(req, res));
const forgotPassword = asyncHandler(async (req, res) => notImplemented(req, res));
const resetPassword = asyncHandler(async (req, res) => notImplemented(req, res));
const logOut = asyncHandler(async (req, res) => notImplemented(req, res));
const getProfile = asyncHandler(async (req, res) => notImplemented(req, res));
const updateProfile = asyncHandler(async (req, res) => notImplemented(req, res));

module.exports = { signup, verifyOtp, resendOtp, signin, forgotPassword, resetPassword, logOut, getProfile, updateProfile };
