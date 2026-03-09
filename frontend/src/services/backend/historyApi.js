import apiClient from "../api/apiClient";

export const historyApi = {
  getAll: (limit = 20) => apiClient.get(`/api/history?limit=${limit}`),
  addOrUpdate: (payload) => apiClient.post("/api/history", payload),
  remove: ({ movieId, mediaType = "movie" }) =>
    apiClient.delete(`/api/history/${movieId}?mediaType=${mediaType}`),
  clear: () => apiClient.delete("/api/history"),
};
