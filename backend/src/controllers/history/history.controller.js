const WatchHistory = require("../../models/watch-history.model");
const AppError = require("../../utils/app-error");
const asyncHandler = require("../../utils/async-handler");

const addOrUpdateHistory = asyncHandler(async (req, res) => {
  const { movieId, mediaType = "movie", title, posterPath = "", releaseDate = "" } =
    req.body;

  const filter = {
    user: req.user._id,
    movieId: String(movieId).trim(),
    mediaType: String(mediaType).toLowerCase(),
  };

  const existing = await WatchHistory.findOne(filter);

  let history;
  if (existing) {
    existing.title = String(title).trim();
    existing.posterPath = String(posterPath).trim();
    existing.releaseDate = String(releaseDate).trim();
    existing.lastWatchedAt = new Date();
    existing.watchCount += 1;
    history = await existing.save();
  } else {
    history = await WatchHistory.create({
      user: req.user._id,
      movieId: String(movieId).trim(),
      mediaType: String(mediaType).toLowerCase(),
      title: String(title).trim(),
      posterPath: String(posterPath).trim(),
      releaseDate: String(releaseDate).trim(),
      lastWatchedAt: new Date(),
      watchCount: 1,
    });
  }

  return res.status(200).json({
    success: true,
    message: "History updated",
    history,
  });
});

const getHistory = asyncHandler(async (req, res) => {
  const limit = req.query.limit || 20;

  const history = await WatchHistory.find({ user: req.user._id })
    .sort({ lastWatchedAt: -1 })
    .limit(limit)
    .lean();

  return res.status(200).json({
    success: true,
    count: history.length,
    history,
  });
});

const removeHistoryItem = asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const { mediaType = "movie" } = req.query;

  const deleted = await WatchHistory.findOneAndDelete({
    user: req.user._id,
    movieId: String(movieId).trim(),
    mediaType: String(mediaType).toLowerCase(),
  });

  if (!deleted) {
    throw new AppError("History item not found", 404);
  }

  return res.status(200).json({
    success: true,
    message: "History item removed",
  });
});

const clearHistory = asyncHandler(async (req, res) => {
  const result = await WatchHistory.deleteMany({ user: req.user._id });

  return res.status(200).json({
    success: true,
    message: "History cleared",
    deletedCount: result.deletedCount,
  });
});

module.exports = {
  addOrUpdateHistory,
  getHistory,
  removeHistoryItem,
  clearHistory,
};
