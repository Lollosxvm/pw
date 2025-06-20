import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosPrivate from "../../api/axiosPrivate";

export const fetchAndamentoInvestimenti = createAsyncThunk(
  "investimenti/fetchAndamento",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosPrivate.get("/investimenti/andamento");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.messaggio || "Errore durante il recupero andamento"
      );
    }
  }
);

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
    andamento: null,
    loadingAndamento: false,
    erroreAndamento: null,
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
      })
      .addCase(fetchAndamentoInvestimenti.pending, (state) => {
        state.loadingAndamento = true;
        state.erroreAndamento = null;
      })
      .addCase(fetchAndamentoInvestimenti.fulfilled, (state, action) => {
        state.loadingAndamento = false;
        state.andamento = action.payload;
      })
      .addCase(fetchAndamentoInvestimenti.rejected, (state, action) => {
        state.loadingAndamento = false;
        state.erroreAndamento = action.payload;
      });
  },
});

export default investimentiSlice.reducer;
