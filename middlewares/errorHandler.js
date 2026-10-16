const errorHandler = (err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || (err.name === "ValidationError" ? 400 : 500);
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = { errorHandler };
