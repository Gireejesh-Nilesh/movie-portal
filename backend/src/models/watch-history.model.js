const mongoose = require("mongoose");

const watchHistorySchema = new mongoose.Schema(
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
    lastWatchedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    watchCount: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

watchHistorySchema.index({ user: 1, movieId: 1, mediaType: 1 }, { unique: true });

const WatchHistory = mongoose.model("WatchHistory", watchHistorySchema);

module.exports = WatchHistory;
