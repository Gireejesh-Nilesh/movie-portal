import apiClient from "../api/apiClient";

export const authApi = {
  signup: (payload) => apiClient.post("/api/auth/signup", payload),
  login: (payload) => apiClient.post("/api/auth/login", payload),
  logout: () => apiClient.post("/api/auth/logout"),
  me: () => apiClient.get("/api/auth/me"),
};
