// Standard JSON response helper
const sendResponse = (
  res,
  { statusCode = 200, success = true, message = "", data = null } = {}
) => {
  const payload = { success, message };

  if (data !== null && data !== undefined) {
    payload.data = data;
  }

  return res.status(statusCode).json(payload);
};

module.exports = { sendResponse };