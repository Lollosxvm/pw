import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosPrivate from "../../api/axiosPrivate";

export const fetchTransazioni = createAsyncThunk(
  "dashboard/fetchTransazioni",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosPrivate.get("/transazioni/spese-recenti");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchMutuo = createAsyncThunk(
  "dashboard/fetchMutuo",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosPrivate.get("/mutuo/situazione");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchPrestito = createAsyncThunk(
  "dashboard/fetchPrestito",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosPrivate.get("/prestiti/situazione");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    transazioni: [],
    mutuo: null,
    prestito: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransazioni.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTransazioni.fulfilled, (state, action) => {
        state.transazioni = action.payload;
        state.loading = false;
      })
      .addCase(fetchMutuo.fulfilled, (state, action) => {
        state.mutuo = action.payload;
      })
      .addCase(fetchPrestito.fulfilled, (state, action) => {
        state.prestito = action.payload;
      })
      .addCase(fetchTransazioni.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;
