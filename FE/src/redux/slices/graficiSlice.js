import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosPrivate from "../../api/axiosPrivate";

export const fetchGrafici = createAsyncThunk(
  "grafici/fetchGrafici",
  async ({ from, to }, { rejectWithValue }) => {
    try {
      const res = await axiosPrivate.get("/transazioni/spese-per-paese", {
        params: { from, to },
      });

      const aggregati = {};
      res.data.forEach(({ mese, categoria, totale }) => {
        if (!aggregati[mese]) aggregati[mese] = { mese };
        aggregati[mese][categoria] = parseFloat(totale);
      });

      return Object.values(aggregati);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const graficiSlice = createSlice({
  name: "grafici",
  initialState: {
    dataset: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGrafici.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGrafici.fulfilled, (state, action) => {
        state.dataset = action.payload;
        state.loading = false;
      })
      .addCase(fetchGrafici.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default graficiSlice.reducer;
