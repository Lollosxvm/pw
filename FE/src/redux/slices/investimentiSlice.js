import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosPrivate from "../../api/axiosPrivate";

export const fetchAndamentoInvestimenti = createAsyncThunk(
  "investimenti/fetchAndamento",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosPrivate.get("/investimenti/andamento");
      return res.data;
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.messaggio || err.message;

      if (status === 401) {
        return rejectWithValue(
          "[TODO] Utente non autenticato: Passcode api cambiata!"
        );
      }

      if (status === 403) {
        return rejectWithValue(
          "[TODO] Accesso negato: Quota mensile raggiunta"
        );
      }

      if (status === 404) {
        return rejectWithValue(
          "[TODO] Dati non trovati per l’intervallo richiesto."
        );
      }

      if (status === 500) {
        return rejectWithValue(
          "[TODO] Errore interno del server. Riprova più tardi."
        );
      }

      return rejectWithValue(`[TODO] Errore imprevisto: ${message}`);
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
