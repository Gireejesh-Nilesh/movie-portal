import apiClient from "../api/apiClient";

export const favoritesApi = {
  getAll: () => apiClient.get("/api/favorites"),
  add: (payload) => apiClient.post("/api/favorites", payload),
  remove: ({ movieId, mediaType = "movie" }) =>
    apiClient.delete(`/api/favorites/${movieId}?mediaType=${mediaType}`),
};
