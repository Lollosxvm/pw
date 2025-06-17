import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosPrivate from "../../api/axiosPrivate";

export const fetchMutuo = createAsyncThunk(
  "mutuo/fetchMutuo",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosPrivate.get("/mutuo/situazione");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const mutuoSlice = createSlice({
  name: "mutuo",
  initialState: {
    dati: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMutuo.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMutuo.fulfilled, (state, action) => {
        state.dati = action.payload;
        state.loading = false;
      })
      .addCase(fetchMutuo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default mutuoSlice.reducer;
