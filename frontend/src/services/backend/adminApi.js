import apiClient from "../api/apiClient";

export const adminApi = {
  getMovies: () => apiClient.get("/api/admin/movies"),
  addMovie: (payload) => apiClient.post("/api/admin/movies", payload),
  updateMovie: (id, payload) => apiClient.put(`/api/admin/movies/${id}`, payload),
  deleteMovie: (id) => apiClient.delete(`/api/admin/movies/${id}`),
  getUsers: () => apiClient.get("/api/admin/users"),
  banUser: (id, isBanned) => apiClient.patch(`/api/admin/users/${id}/ban`, { isBanned }),
  deleteUser: (id) => apiClient.delete(`/api/admin/users/${id}`),
  getStats: () => apiClient.get("/api/admin/stats"),
};
