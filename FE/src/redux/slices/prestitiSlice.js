import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosPrivate from "../../api/axiosPrivate";

export const fetchPrestiti = createAsyncThunk(
  "prestiti/fetchPrestiti",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosPrivate.get("/prestiti/situazione");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const prestitiSlice = createSlice({
  name: "prestiti",
  initialState: {
    dati: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPrestiti.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPrestiti.fulfilled, (state, action) => {
        state.dati = action.payload;
        state.loading = false;
      })
      .addCase(fetchPrestiti.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default prestitiSlice.reducer;
