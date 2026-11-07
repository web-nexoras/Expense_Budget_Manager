const jwt = require("jsonwebtoken");
const User = require("../modules/auth/authModel");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken;
    if (!token) {
      return res.status(401).json({ success: false, message: "Access token is missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SEC);
    const user = await User.findById(decoded._id).select("-password");
    if (!user || !user.isActive || (user.role === "user" && !user.isApproved)) {
      return res.status(401).json({ success: false, message: "Account is unavailable" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Unauthorized or token expired" });
  }
};

module.exports = { authMiddleware };
