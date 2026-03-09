const mongoose = require("mongoose");

const adminMovieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    posterImageUrl: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    movieId: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    releaseDate: {
      type: String,
      required: true,
      trim: true,
    },
    trailerYouTubeLink: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: [String],
      required: true,
      default: [],
    },
    category: {
      type: String,
      enum: ["movie", "tv"],
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AdminMovie = mongoose.model("AdminMovie", adminMovieSchema);

module.exports = AdminMovie;
