const crypto = require("crypto");
const jwt = require("jsonwebtoken");


// --------- Generate a random 4-digit OTP
const generateOTP = () => {
  return crypto.randomInt(1000, 10000).toString();
};

//-------Access Token Generate
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SEC,
    { expiresIn: "7d" },
  );
};

// ---------refresh token generate
const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SEC,
    { expiresIn: "15d" },
  );
};



module.exports = {
  generateOTP,
  generateAccessToken,
  generateRefreshToken
};