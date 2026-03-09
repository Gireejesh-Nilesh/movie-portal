const AppError = require("../../utils/app-error");

const TMDB_BASE_URL = process.env.TMDB_BASE_URL || "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL =
  process.env.TMDB_IMAGE_BASE_URL || "https://image.tmdb.org/t/p/w500";
const POSTER_PLACEHOLDER =
  process.env.POSTER_PLACEHOLDER ||
  "https://via.placeholder.com/500x750?text=Poster+Unavailable";

const getApiKey = () => {
  const key = process.env.TMDB_API_KEY;
  if (!key || key.includes("<YOUR_TMDB_API_KEY>")) {
    throw new AppError("TMDB_API_KEY is missing or invalid in environment", 500);
  }
  return key;
};

const buildImageUrl = (path) => {
  if (!path) {
    return POSTER_PLACEHOLDER;
  }
  return `${TMDB_IMAGE_BASE_URL}${path}`;
};

const normalizeMediaItem = (item) => {
  const mediaType = item.media_type || (item.first_air_date ? "tv" : "movie");

  return {
    id: item.id,
    mediaType,
    title: item.title || item.name || "Untitled",
    posterPath: item.poster_path || null,
    posterUrl: buildImageUrl(item.poster_path),
    backdropPath: item.backdrop_path || null,
    backdropUrl: item.backdrop_path ? buildImageUrl(item.backdrop_path) : null,
    description: item.overview?.trim() || "Description not available",
    releaseDate: item.release_date || item.first_air_date || "",
    originalLanguage: item.original_language || "",
    rating: item.vote_average || 0,
    popularity: item.popularity || 0,
  };
};

const tmdbRequest = async (path, query = {}) => {
  const apiKey = getApiKey();
  const params = new URLSearchParams({ api_key: apiKey });

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  const url = `${TMDB_BASE_URL}${path}?${params.toString()}`;
  const response = await fetch(url);

  let payload = null;
  try {
    payload = await response.json();
  } catch (error) {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.status_message || "TMDB request failed";
    throw new AppError(message, response.status || 502);
  }

  return payload;
};

const mapPagedResult = (payload) => {
  return {
    page: payload.page || 1,
    totalPages: payload.total_pages || 1,
    totalResults: payload.total_results || 0,
    results: (payload.results || []).map(normalizeMediaItem),
  };
};

const getTrending = async ({ mediaType = "all", timeWindow = "week", page = 1 }) => {
  const payload = await tmdbRequest(`/trending/${mediaType}/${timeWindow}`, { page });
  return mapPagedResult(payload);
};

const getPopularMovies = async ({ page = 1 }) => {
  const payload = await tmdbRequest("/movie/popular", { page });
  return mapPagedResult(payload);
};

const getPopularTVShows = async ({ page = 1 }) => {
  const payload = await tmdbRequest("/tv/popular", { page });
  return mapPagedResult(payload);
};

const getDiscoverMovies = async ({ page = 1 }) => {
  const payload = await tmdbRequest("/discover/movie", { page, sort_by: "popularity.desc" });
  return mapPagedResult(payload);
};

const getDiscoverTVShows = async ({ page = 1 }) => {
  const payload = await tmdbRequest("/discover/tv", { page, sort_by: "popularity.desc" });
  return mapPagedResult(payload);
};

const getPopularPeople = async ({ page = 1 }) => {
  const payload = await tmdbRequest("/person/popular", { page });

  return {
    page: payload.page || 1,
    totalPages: payload.total_pages || 1,
    totalResults: payload.total_results || 0,
    results: (payload.results || []).map((person) => ({
      id: person.id,
      mediaType: "person",
      name: person.name || "Unknown",
      profilePath: person.profile_path || null,
      profileUrl: buildImageUrl(person.profile_path),
      knownForDepartment: person.known_for_department || "",
      popularity: person.popularity || 0,
    })),
  };
};

const searchMulti = async ({ query, page = 1 }) => {
  const payload = await tmdbRequest("/search/multi", { query, page, include_adult: false });

  return {
    page: payload.page || 1,
    totalPages: payload.total_pages || 1,
    totalResults: payload.total_results || 0,
    results: (payload.results || []).map((item) => {
      if (item.media_type === "person") {
        return {
          id: item.id,
          mediaType: "person",
          name: item.name || "Unknown",
          profilePath: item.profile_path || null,
          profileUrl: buildImageUrl(item.profile_path),
          knownForDepartment: item.known_for_department || "",
          popularity: item.popularity || 0,
        };
      }

      return normalizeMediaItem(item);
    }),
  };
};

const getMovieTrailer = async ({ movieId }) => {
  const payload = await tmdbRequest(`/movie/${movieId}/videos`);
  const videos = payload.results || [];

  const trailer =
    videos.find((video) => video.site === "YouTube" && video.type === "Trailer") ||
    videos.find((video) => video.site === "YouTube");

  if (!trailer) {
    return {
      available: false,
      message: "Trailer not available",
      trailer: null,
    };
  }

  return {
    available: true,
    message: "Trailer available",
    trailer: {
      id: trailer.id,
      key: trailer.key,
      name: trailer.name,
      site: trailer.site,
      type: trailer.type,
      youtubeUrl: `https://www.youtube.com/watch?v=${trailer.key}`,
      embedUrl: `https://www.youtube.com/embed/${trailer.key}`,
    },
  };
};

const getTVTrailer = async ({ tvId }) => {
  const payload = await tmdbRequest(`/tv/${tvId}/videos`);
  const videos = payload.results || [];

  const trailer =
    videos.find((video) => video.site === "YouTube" && video.type === "Trailer") ||
    videos.find((video) => video.site === "YouTube");

  if (!trailer) {
    return {
      available: false,
      message: "Trailer not available",
      trailer: null,
    };
  }

  return {
    available: true,
    message: "Trailer available",
    trailer: {
      id: trailer.id,
      key: trailer.key,
      name: trailer.name,
      site: trailer.site,
      type: trailer.type,
      youtubeUrl: `https://www.youtube.com/watch?v=${trailer.key}`,
      embedUrl: `https://www.youtube.com/embed/${trailer.key}`,
    },
  };
};

const getMovieDetails = async ({ movieId }) => {
  const payload = await tmdbRequest(`/movie/${movieId}`);
  const normalized = normalizeMediaItem({ ...payload, media_type: "movie" });

  return {
    ...normalized,
    runtime: payload.runtime || 0,
    genres: (payload.genres || []).map((genre) => genre.name),
    language: payload.original_language || "",
    status: payload.status || "",
  };
};

const getTVDetails = async ({ tvId }) => {
  const payload = await tmdbRequest(`/tv/${tvId}`);
  const normalized = normalizeMediaItem({
    ...payload,
    media_type: "tv",
    name: payload.name,
    first_air_date: payload.first_air_date,
  });

  return {
    ...normalized,
    numberOfSeasons: payload.number_of_seasons || 0,
    numberOfEpisodes: payload.number_of_episodes || 0,
    genres: (payload.genres || []).map((genre) => genre.name),
    language: payload.original_language || "",
    status: payload.status || "",
  };
};

const getPersonDetails = async ({ personId }) => {
  const payload = await tmdbRequest(`/person/${personId}`);

  return {
    id: payload.id,
    mediaType: "person",
    name: payload.name || "Unknown",
    profilePath: payload.profile_path || null,
    profileUrl: buildImageUrl(payload.profile_path),
    biography: payload.biography?.trim() || "Biography not available.",
    knownForDepartment: payload.known_for_department || "",
    popularity: payload.popularity || 0,
    birthday: payload.birthday || "",
    placeOfBirth: payload.place_of_birth || "",
  };
};

module.exports = {
  getTrending,
  getPopularMovies,
  getPopularTVShows,
  getDiscoverMovies,
  getDiscoverTVShows,
  getPopularPeople,
  searchMulti,
  getMovieTrailer,
  getTVTrailer,
  getMovieDetails,
  getTVDetails,
  getPersonDetails,
};
