const Favorite = require("../../models/favorite.model");
const AppError = require("../../utils/app-error");
const asyncHandler = require("../../utils/async-handler");

const addFavorite = asyncHandler(async (req, res) => {
  const {
    movieId,
    mediaType = "movie",
    title,
    posterPath = "",
    releaseDate = "",
  } = req.body;

  const favoritePayload = {
    user: req.user._id,
    movieId: String(movieId).trim(),
    mediaType: String(mediaType).toLowerCase(),
    title: String(title).trim(),
    posterPath: String(posterPath).trim(),
    releaseDate: String(releaseDate).trim(),
  };

  const existingFavorite = await Favorite.findOne({
    user: favoritePayload.user,
    movieId: favoritePayload.movieId,
    mediaType: favoritePayload.mediaType,
  }).lean();

  if (existingFavorite) {
    return res.status(200).json({
      success: true,
      message: "Already in favorites",
      favorite: existingFavorite,
    });
  }

  let favorite;
  try {
    favorite = await Favorite.findOneAndUpdate(
      {
        user: favoritePayload.user,
        movieId: favoritePayload.movieId,
        mediaType: favoritePayload.mediaType,
      },
      {
        $setOnInsert: favoritePayload,
      },
      {
        upsert: true,
        new: true,
      }
    );
  } catch (error) {
    if (error?.code === 11000) {
      const duplicateFavorite = await Favorite.findOne({
        user: favoritePayload.user,
        movieId: favoritePayload.movieId,
        mediaType: favoritePayload.mediaType,
      }).lean();

      return res.status(200).json({
        success: true,
        message: "Already in favorites",
        favorite: duplicateFavorite,
      });
    }
    throw error;
  }

  return res.status(201).json({
    success: true,
    message: "Added to favorites",
    favorite,
  });
});

const getFavorites = asyncHandler(async (req, res) => {
  const favorites = await Favorite.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json({
    success: true,
    count: favorites.length,
    favorites,
  });
});

const removeFavorite = asyncHandler(async (req, res) => {
  const { movieId } = req.params;
  const { mediaType = "movie" } = req.query;

  const deleted = await Favorite.findOneAndDelete({
    user: req.user._id,
    movieId: String(movieId).trim(),
    mediaType: String(mediaType).toLowerCase(),
  });

  if (!deleted) {
    throw new AppError("Favorite not found", 404);
  }

  return res.status(200).json({
    success: true,
    message: "Removed from favorites",
  });
});

module.exports = {
  addFavorite,
  getFavorites,
  removeFavorite,
};
