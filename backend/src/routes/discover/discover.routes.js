const express = require("express");
const validate = require("../../middlewares/validate.middleware");
const {
  getTrending,
  getPopularMovies,
  getPopularTVShows,
  getDiscoverMovies,
  getDiscoverTVShows,
  getPopularPeople,
  getMovieTrailer,
  getTVTrailer,
  getMovieDetails,
  getTVDetails,
  getPersonDetails,
} = require("../../controllers/movies/discover.controller");
const {
  discoverPageSchema,
  trendingSchema,
  movieTrailerSchema,
} = require("../../validators/tmdb.validator");

const router = express.Router();

router.get("/trending", validate(trendingSchema), getTrending);
router.get("/popular/movies", validate(discoverPageSchema), getPopularMovies);
router.get("/popular/tv", validate(discoverPageSchema), getPopularTVShows);
router.get("/movies", validate(discoverPageSchema), getDiscoverMovies);
router.get("/tv", validate(discoverPageSchema), getDiscoverTVShows);
router.get("/people", validate(discoverPageSchema), getPopularPeople);
router.get("/movies/:id", validate(movieTrailerSchema), getMovieDetails);
router.get("/tv/:id", validate(movieTrailerSchema), getTVDetails);
router.get("/people/:id", validate(movieTrailerSchema), getPersonDetails);
router.get("/movies/:id/trailer", validate(movieTrailerSchema), getMovieTrailer);
router.get("/tv/:id/trailer", validate(movieTrailerSchema), getTVTrailer);

module.exports = router;
