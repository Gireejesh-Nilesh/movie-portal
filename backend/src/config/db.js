const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "movie_platform";

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing in environment variables");
  }

  await mongoose.connect(mongoUri.trim(), {
    dbName,
    serverSelectionTimeoutMS: 10000,
  });
  console.log(`MongoDB connected (${dbName})`);
};

module.exports = connectDB;
