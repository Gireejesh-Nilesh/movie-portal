import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import moviesReducer from "../features/movies/moviesSlice";
import searchReducer from "../features/search/searchSlice";
import favoritesReducer from "../features/favorites/favoritesSlice";
import historyReducer from "../features/history/historySlice";
import adminReducer from "../features/admin/adminSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: moviesReducer,
    search: searchReducer,
    favorites: favoritesReducer,
    history: historyReducer,
    admin: adminReducer,
  },
});

