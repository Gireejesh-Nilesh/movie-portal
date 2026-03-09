import { createSlice } from "@reduxjs/toolkit";
import { fetchHomeDataThunk } from "./moviesThunks";

const initialState = {
  trending: [],
  popularMovies: [],
  popularTV: [],
  people: [],
  loading: false,
  error: null,
};

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    setMoviesLoading(state, action) {
      state.loading = action.payload;
    },
    setTrending(state, action) {
      state.trending = action.payload;
    },
    setPopularMovies(state, action) {
      state.popularMovies = action.payload;
    },
    setPopularTV(state, action) {
      state.popularTV = action.payload;
    },
    setPeople(state, action) {
      state.people = action.payload;
    },
    setMoviesError(state, action) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeDataThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHomeDataThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.trending = action.payload.trending;
        state.popularMovies = action.payload.popularMovies;
        state.popularTV = action.payload.popularTV;
        state.people = action.payload.people;
      })
      .addCase(fetchHomeDataThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load movies";
      });
  },
});

export const {
  setMoviesLoading,
  setTrending,
  setPopularMovies,
  setPopularTV,
  setPeople,
  setMoviesError,
} = moviesSlice.actions;

export default moviesSlice.reducer;
