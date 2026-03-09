const { z } = require("zod");

const mediaTypeSchema = z.enum(["movie", "tv"]);

const addOrUpdateHistorySchema = {
  body: z.object({
    movieId: z.union([z.string(), z.number()]).transform((v) => String(v).trim()),
    mediaType: mediaTypeSchema.optional().default("movie"),
    title: z.string().trim().min(1).max(200),
    posterPath: z.string().trim().optional().default(""),
    releaseDate: z.string().trim().optional().default(""),
  }),
};

const getHistorySchema = {
  query: z.object({
    limit: z.coerce.number().int().positive().max(100).optional(),
  }),
};

const removeHistorySchema = {
  params: z.object({
    movieId: z.string().trim().min(1),
  }),
  query: z.object({
    mediaType: mediaTypeSchema.optional().default("movie"),
  }),
};

module.exports = {
  addOrUpdateHistorySchema,
  getHistorySchema,
  removeHistorySchema,
};
