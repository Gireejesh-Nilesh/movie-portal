const AdminMovie = require("../../models/admin-movie.model");
const AppError = require("../../utils/app-error");
const asyncHandler = require("../../utils/async-handler");

const addMovie = asyncHandler(async (req, res) => {
  const payload = req.body;

  const existing = await AdminMovie.findOne({ movieId: payload.movieId });
  if (existing) {
    throw new AppError("Movie already exists with this movieId", 409);
  }

  const movie = await AdminMovie.create({
    ...payload,
    createdBy: req.user._id,
  });

  return res.status(201).json({
    success: true,
    message: "Movie added successfully",
    movie,
  });
});

const getMovies = asyncHandler(async (req, res) => {
  const movies = await AdminMovie.find()
    .sort({ createdAt: -1 })
    .populate("createdBy", "name email role")
    .lean();

  return res.status(200).json({
    success: true,
    count: movies.length,
    movies,
  });
});

const updateMovie = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const movie = await AdminMovie.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!movie) {
    throw new AppError("Movie not found", 404);
  }

  return res.status(200).json({
    success: true,
    message: "Movie updated successfully",
    movie,
  });
});

const deleteMovie = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const movie = await AdminMovie.findByIdAndDelete(id);
  if (!movie) {
    throw new AppError("Movie not found", 404);
  }

  return res.status(200).json({
    success: true,
    message: "Movie deleted successfully",
  });
});

module.exports = {
  addMovie,
  getMovies,
  updateMovie,
  deleteMovie,
};
