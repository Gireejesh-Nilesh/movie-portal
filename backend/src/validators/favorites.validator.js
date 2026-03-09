const { z } = require("zod");

const mediaTypeSchema = z.enum(["movie", "tv"]);

const addFavoriteSchema = {
  body: z.object({
    movieId: z.union([z.string(), z.number()]).transform((v) => String(v).trim()),
    mediaType: mediaTypeSchema.optional().default("movie"),
    title: z.string().trim().min(1).max(200),
    posterPath: z.string().trim().optional().default(""),
    releaseDate: z.string().trim().optional().default(""),
  }),
};

const removeFavoriteSchema = {
  params: z.object({
    movieId: z.string().trim().min(1),
  }),
  query: z.object({
    mediaType: mediaTypeSchema.optional().default("movie"),
  }),
};

module.exports = {
  addFavoriteSchema,
  removeFavoriteSchema,
};
