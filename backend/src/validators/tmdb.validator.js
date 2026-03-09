const { z } = require("zod");

const pageSchema = z.coerce.number().int().positive().max(500).optional().default(1);

const discoverPageSchema = {
  query: z.object({
    page: pageSchema,
  }),
};

const trendingSchema = {
  query: z.object({
    page: pageSchema,
    mediaType: z.enum(["all", "movie", "tv", "person"]).optional().default("all"),
    timeWindow: z.enum(["day", "week"]).optional().default("week"),
  }),
};

const movieTrailerSchema = {
  params: z.object({
    id: z.string().trim().min(1),
  }),
};

const searchSchema = {
  query: z.object({
    q: z.string().trim().min(1),
    page: pageSchema,
  }),
};

module.exports = {
  discoverPageSchema,
  trendingSchema,
  movieTrailerSchema,
  searchSchema,
};
