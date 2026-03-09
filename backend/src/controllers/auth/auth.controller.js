const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");
const AppError = require("../../utils/app-error");
const asyncHandler = require("../../utils/async-handler");

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME || "token";

const createToken = (user) => {
  return jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};

const setAuthCookie = (res, token) => {
  res.cookie(AUTH_COOKIE_NAME, token, getCookieOptions());
};

const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new AppError("User already exists with this email", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
  });

  const token = createToken(user);
  setAuthCookie(res, token);

  return res.status(201).json({
    success: true,
    message: "Signup successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const normalizedEmail = email.toLowerCase().trim();
  const user = await User.findOne({ email: normalizedEmail }).select(
    "+password"
  );

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (user.isBanned) {
    throw new AppError("Your account is banned", 403);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = createToken(user);
  setAuthCookie(res, token);

  return res.status(200).json({
    success: true,
    message: "Login successful",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
});

const logout = asyncHandler(async (req, res) => {
  res.clearCookie(AUTH_COOKIE_NAME, getCookieOptions());
  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

module.exports = {
  signup,
  login,
  logout,
  getCurrentUser,
};
