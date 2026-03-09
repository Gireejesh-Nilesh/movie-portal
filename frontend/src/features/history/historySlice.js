import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const historySlice = createSlice({
  name: "history",
  initialState,
  reducers: {
    setHistoryLoading(state, action) {
      state.loading = action.payload;
    },
    setHistory(state, action) {
      state.items = action.payload;
    },
    setHistoryError(state, action) {
      state.error = action.payload;
    },
    clearHistoryState(state) {
      state.items = [];
      state.error = null;
    },
  },
});

export const { setHistoryLoading, setHistory, setHistoryError, clearHistoryState } =
  historySlice.actions;

export default historySlice.reducer;

