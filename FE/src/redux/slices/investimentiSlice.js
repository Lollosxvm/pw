import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosPrivate from "../../api/axiosPrivate";

export const fetchInvestimenti = createAsyncThunk(
  "investimenti/fetchInvestimenti",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosPrivate.get("/investimenti");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const investimentiSlice = createSlice({
  name: "investimenti",
  initialState: {
    dati: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvestimenti.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInvestimenti.fulfilled, (state, action) => {
        state.dati = action.payload;
        state.loading = false;
      })
      .addCase(fetchInvestimenti.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default investimentiSlice.reducer;
