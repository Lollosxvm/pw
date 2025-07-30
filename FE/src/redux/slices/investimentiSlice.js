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
          "Utente non autenticato. Effettua nuovamente il login."
        );
      }

      if (status === 403) {
        return rejectWithValue(
          "Accesso negato. Limite mensile delle operazioni raggiunto."
        );
      }

      if (status === 404) {
        return rejectWithValue(
          "Nessun dato disponibile per l’intervallo richiesto."
        );
      }

      if (status === 500) {
        return rejectWithValue(
          "Errore interno del server. Ti invitiamo a riprovare più tardi."
        );
      }

      return rejectWithValue(`Errore imprevisto: ${message}`);
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
      return rejectWithValue(
        `Errore durante il caricamento degli investimenti: ${err.message}`
      );
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
        state.error = null;
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
