import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../../services/backend/authApi";

export const signupThunk = createAsyncThunk(
  "auth/signup",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authApi.signup(payload);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.message || "Signup failed");
    }
  },
);

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authApi.login(payload);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.message || "Login failed");
    }
  },
);

export const fetchMeThunk = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.me();
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.message || "Unable to fetch user");
    }
  },
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      return true;
    } catch (error) {
      return rejectWithValue(error.message || "Logout failed");
    }
  },
);
