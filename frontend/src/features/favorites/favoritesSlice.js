import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    setFavoritesLoading(state, action) {
      state.loading = action.payload;
    },
    setFavorites(state, action) {
      state.items = action.payload;
    },
    addFavorite(state, action) {
      state.items.unshift(action.payload);
    },
    removeFavorite(state, action) {
      state.items = state.items.filter(
        (item) =>
          !(
            String(item.movieId) === String(action.payload.movieId) &&
            item.mediaType === action.payload.mediaType
          ),
      );
    },
    setFavoritesError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  setFavoritesLoading,
  setFavorites,
  addFavorite,
  removeFavorite,
  setFavoritesError,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
