const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    movieId: {
      type: String,
      required: true,
      trim: true,
    },
    mediaType: {
      type: String,
      enum: ["movie", "tv"],
      default: "movie",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    posterPath: {
      type: String,
      default: "",
      trim: true,
    },
    releaseDate: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

favoriteSchema.index({ user: 1, movieId: 1, mediaType: 1 }, { unique: true });

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
