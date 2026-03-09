const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const AppError = require("../utils/app-error");
const asyncHandler = require("../utils/async-handler");
const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "token";

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const headerToken = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;
  const cookieToken = req.cookies ? req.cookies[AUTH_COOKIE_NAME] : null;
  const token = cookieToken || headerToken;

  if (!token) {
    throw new AppError("Unauthorized: token missing", 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new AppError("Unauthorized: invalid token", 401);
  }

  const user = await User.findById(decoded.userId).select("-password");
  if (!user) {
    throw new AppError("Unauthorized: user not found", 401);
  }

  if (user.isBanned) {
    throw new AppError("Access denied: user is banned", 403);
  }

  req.user = user;
  next();
});

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new AppError("Forbidden: insufficient permissions", 403));
    }

    next();
  };
};

module.exports = {
  protect,
  authorizeRoles,
};
