import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosPrivate from "../../api/axiosPrivate";

export const fetchNews = createAsyncThunk(
  "news/fetchNews",
  async (asset, { getState, rejectWithValue }) => {
    const state = getState();
    if (state.news.cache[asset]) {
      return state.news.cache[asset];
    }

    try {
      const response = await axiosPrivate.get("/news", {
        params: { asset },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const newsSlice = createSlice({
  name: "news",
  initialState: {
    cache: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        const asset = action.meta.arg;
        state.cache[asset] = action.payload;
        state.loading = false;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default newsSlice.reducer;
