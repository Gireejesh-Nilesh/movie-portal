const User = require("../../models/user.model");
const Favorite = require("../../models/favorite.model");
const WatchHistory = require("../../models/watch-history.model");
const AdminMovie = require("../../models/admin-movie.model");
const AppError = require("../../utils/app-error");
const asyncHandler = require("../../utils/async-handler");

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 }).lean();

  return res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

const banUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isBanned } = req.body;

  if (req.user._id.toString() === id) {
    throw new AppError("You cannot ban/unban yourself", 400);
  }

  const user = await User.findByIdAndUpdate(
    id,
    { isBanned },
    { new: true, runValidators: true }
  ).select("-password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return res.status(200).json({
    success: true,
    message: isBanned ? "User banned successfully" : "User unbanned successfully",
    user,
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (req.user._id.toString() === id) {
    throw new AppError("You cannot delete yourself", 400);
  }

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  return res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

const getPlatformStats = asyncHandler(async (req, res) => {
  const [usersCount, bannedUsersCount, moviesCount, favoritesCount, historyCount] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isBanned: true }),
      AdminMovie.countDocuments(),
      Favorite.countDocuments(),
      WatchHistory.countDocuments(),
    ]);

  return res.status(200).json({
    success: true,
    stats: {
      usersCount,
      bannedUsersCount,
      moviesCount,
      favoritesCount,
      historyCount,
    },
  });
});

module.exports = {
  getUsers,
  banUser,
  deleteUser,
  getPlatformStats,
};
