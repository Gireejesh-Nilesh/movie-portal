const AppError = require("../utils/app-error");

const notFound = (req, res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, 404));
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  if (err.name === "CastError") {
    statusCode = 400;
    message = "Invalid resource id";
  }

  if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate value found";
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Unauthorized: invalid token";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Unauthorized: token expired";
  }

  const response = {
    success: false,
    message,
  };

  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

module.exports = {
  notFound,
  errorHandler,
};
