const asyncHandler = require("../../utils/async-handler");
const tmdbService = require("../../services/tmdb/tmdb.service");

const getTrending = asyncHandler(async (req, res) => {
  const { page, mediaType, timeWindow } = req.query;
  const data = await tmdbService.getTrending({ page, mediaType, timeWindow });

  return res.status(200).json({
    success: true,
    section: "trending",
    ...data,
  });
});

const getPopularMovies = asyncHandler(async (req, res) => {
  const { page } = req.query;
  const data = await tmdbService.getPopularMovies({ page });

  return res.status(200).json({
    success: true,
    section: "popular-movies",
    ...data,
  });
});

const getPopularTVShows = asyncHandler(async (req, res) => {
  const { page } = req.query;
  const data = await tmdbService.getPopularTVShows({ page });

  return res.status(200).json({
    success: true,
    section: "popular-tv",
    ...data,
  });
});

const getDiscoverMovies = asyncHandler(async (req, res) => {
  const { page } = req.query;
  const data = await tmdbService.getDiscoverMovies({ page });

  return res.status(200).json({
    success: true,
    section: "discover-movies",
    ...data,
  });
});

const getDiscoverTVShows = asyncHandler(async (req, res) => {
  const { page } = req.query;
  const data = await tmdbService.getDiscoverTVShows({ page });

  return res.status(200).json({
    success: true,
    section: "discover-tv",
    ...data,
  });
});

const getPopularPeople = asyncHandler(async (req, res) => {
  const { page } = req.query;
  const data = await tmdbService.getPopularPeople({ page });

  return res.status(200).json({
    success: true,
    section: "popular-people",
    ...data,
  });
});

const getMovieTrailer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await tmdbService.getMovieTrailer({ movieId: id });

  return res.status(200).json({
    success: true,
    movieId: id,
    ...data,
  });
});

const getTVTrailer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await tmdbService.getTVTrailer({ tvId: id });

  return res.status(200).json({
    success: true,
    tvId: id,
    ...data,
  });
});

const getMovieDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await tmdbService.getMovieDetails({ movieId: id });

  return res.status(200).json({
    success: true,
    movie: data,
  });
});

const getTVDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await tmdbService.getTVDetails({ tvId: id });

  return res.status(200).json({
    success: true,
    tv: data,
  });
});

const getPersonDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = await tmdbService.getPersonDetails({ personId: id });

  return res.status(200).json({
    success: true,
    person: data,
  });
});

module.exports = {
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
};
