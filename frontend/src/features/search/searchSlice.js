import { createSlice } from "@reduxjs/toolkit";
import { searchMultiThunk } from "./searchThunks";

const initialState = {
  query: "",
  results: [],
  page: 1,
  hasMore: true,
  loading: false,
  error: null,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.query = action.payload;
    },
    setSearchLoading(state, action) {
      state.loading = action.payload;
    },
    setSearchResults(state, action) {
      state.results = action.payload;
    },
    appendSearchResults(state, action) {
      state.results = [...state.results, ...action.payload];
    },
    setSearchPage(state, action) {
      state.page = action.payload;
    },
    setSearchHasMore(state, action) {
      state.hasMore = action.payload;
    },
    setSearchError(state, action) {
      state.error = action.payload;
    },
    resetSearchState(state) {
      state.results = [];
      state.page = 1;
      state.hasMore = true;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchMultiThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchMultiThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.query = action.payload.query;
        state.page = action.payload.page;
        state.hasMore = action.payload.page < action.payload.totalPages;

        if (action.payload.append) {
          state.results = [...state.results, ...action.payload.results];
        } else {
          state.results = action.payload.results;
        }
      })
      .addCase(searchMultiThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Search failed";
      });
  },
});

export const {
  setSearchQuery,
  setSearchLoading,
  setSearchResults,
  appendSearchResults,
  setSearchPage,
  setSearchHasMore,
  setSearchError,
  resetSearchState,
} = searchSlice.actions;

export default searchSlice.reducer;
