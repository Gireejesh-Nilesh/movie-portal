import apiClient from "../api/apiClient";

export const discoverApi = {
  trending: (params = "") => apiClient.get(`/api/discover/trending${params}`),
  popularMovies: (page = 1) => apiClient.get(`/api/discover/popular/movies?page=${page}`),
  popularTV: (page = 1) => apiClient.get(`/api/discover/popular/tv?page=${page}`),
  movies: (page = 1) => apiClient.get(`/api/discover/movies?page=${page}`),
  tv: (page = 1) => apiClient.get(`/api/discover/tv?page=${page}`),
  people: (page = 1) => apiClient.get(`/api/discover/people?page=${page}`),
  movieDetails: (movieId) => apiClient.get(`/api/discover/movies/${movieId}`),
  tvDetails: (tvId) => apiClient.get(`/api/discover/tv/${tvId}`),
  personDetails: (personId) => apiClient.get(`/api/discover/people/${personId}`),
  trailer: (movieId) => apiClient.get(`/api/discover/movies/${movieId}/trailer`),
  tvTrailer: (tvId) => apiClient.get(`/api/discover/tv/${tvId}/trailer`),
  search: (query, page = 1) =>
    apiClient.get(`/api/search?q=${encodeURIComponent(query)}&page=${page}`),
};
