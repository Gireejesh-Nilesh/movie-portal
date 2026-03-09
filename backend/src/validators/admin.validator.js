const { z } = require("zod");

const mediaCategorySchema = z.enum(["movie", "tv"]);

const adminMovieBaseSchema = z.object({
  title: z.string().trim().min(1).max(200),
  posterImageUrl: z.string().trim().url(),
  description: z.string().trim().min(1).max(2000),
  movieId: z.union([z.string(), z.number()]).transform((v) => String(v).trim()),
  releaseDate: z.string().trim().min(4).max(20),
  trailerYouTubeLink: z.string().trim().url(),
  genre: z.array(z.string().trim().min(1)).min(1),
  category: mediaCategorySchema,
});

const createAdminMovieSchema = {
  body: adminMovieBaseSchema,
};

const updateAdminMovieSchema = {
  params: z.object({
    id: z.string().trim().min(1),
  }),
  body: adminMovieBaseSchema.partial().refine(
    (data) => Object.keys(data).length > 0,
    "At least one field is required for update"
  ),
};

const adminMovieIdParamSchema = {
  params: z.object({
    id: z.string().trim().min(1),
  }),
};

const adminUserIdParamSchema = {
  params: z.object({
    id: z.string().trim().min(1),
  }),
};

const adminBanUserSchema = {
  params: z.object({
    id: z.string().trim().min(1),
  }),
  body: z.object({
    isBanned: z.boolean(),
  }),
};

module.exports = {
  createAdminMovieSchema,
  updateAdminMovieSchema,
  adminMovieIdParamSchema,
  adminUserIdParamSchema,
  adminBanUserSchema,
};
