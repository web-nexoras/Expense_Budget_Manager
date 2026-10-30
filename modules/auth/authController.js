const { asyncHandler } = require("../../middlewares/asyncHandler");
const { sendResponse } = require("../../middlewares/sendResponse");
const authService = require("./authService");

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

module.exports = { signup };
