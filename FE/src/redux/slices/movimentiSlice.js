import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosPrivate from "../../api/axiosPrivate";

export const fetchMovimenti = createAsyncThunk(
  "movimenti/fetchMovimenti",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosPrivate.get("/transazioni");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const movimentiSlice = createSlice({
  name: "movimenti",
  initialState: {
    lista: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovimenti.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMovimenti.fulfilled, (state, action) => {
        state.lista = action.payload;
        state.loading = false;
      })
      .addCase(fetchMovimenti.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default movimentiSlice.reducer;
