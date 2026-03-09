const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth/auth.routes");
const favoritesRoutes = require("./routes/favorites/favorites.routes");
const historyRoutes = require("./routes/history/history.routes");
const adminRoutes = require("./routes/admin/admin.routes");
const discoverRoutes = require("./routes/discover/discover.routes");
const searchRoutes = require("./routes/search/search.routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Movie Platform Backend is running",
  });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is healthy",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/discover", discoverRoutes);
app.use("/api/search", searchRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
