import { createAsyncThunk } from "@reduxjs/toolkit";
import { discoverApi } from "../../services/backend/discoverApi";

export const fetchHomeDataThunk = createAsyncThunk(
  "movies/fetchHomeData",
  async (_, { rejectWithValue }) => {
    try {
      const [trendingRes, popularMoviesRes, popularTVRes, peopleRes] = await Promise.all([
        discoverApi.trending("?page=1&mediaType=all&timeWindow=week"),
        discoverApi.popularMovies(1),
        discoverApi.popularTV(1),
        discoverApi.people(1),
      ]);

      return {
        trending: trendingRes.data.results || [],
        popularMovies: popularMoviesRes.data.results || [],
        popularTV: popularTVRes.data.results || [],
        people: peopleRes.data.results || [],
      };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to load home data");
    }
  }
);
