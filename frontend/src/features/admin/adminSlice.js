import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  movies: [],
  users: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setAdminLoading(state, action) {
      state.loading = action.payload;
    },
    setAdminMovies(state, action) {
      state.movies = action.payload;
    },
    setAdminUsers(state, action) {
      state.users = action.payload;
    },
    setAdminError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setAdminLoading, setAdminMovies, setAdminUsers, setAdminError } =
  adminSlice.actions;

export default adminSlice.reducer;

