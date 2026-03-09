import { createAsyncThunk } from "@reduxjs/toolkit";
import { discoverApi } from "../../services/backend/discoverApi";

export const searchMultiThunk = createAsyncThunk(
  "search/searchMulti",
  async ({ query, page = 1, append = false }, { rejectWithValue }) => {
    try {
      const response = await discoverApi.search(query, page);
      const payload = response.data;

      return {
        query,
        append,
        page: payload.page || page,
        totalPages: payload.totalPages || 1,
        results: payload.results || [],
      };
    } catch (error) {
      return rejectWithValue(error.message || "Search failed");
    }
  }
);
