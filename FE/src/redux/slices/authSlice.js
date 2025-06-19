import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  utente: null,
  accessToken: null,
  saldo: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.utente = action.payload.utente;
      state.accessToken = action.payload.token;
      state.saldo = action.payload.saldo;
      state.loading = false;
    },
    logout: (state) => {
      state.utente = null;
      state.accessToken = null;
      state.saldo = null;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    aggiornaSaldo: (state, action) => {
      state.saldo = action.payload;
    },
  },
});

export const { setAuth, logout, setLoading, aggiornaSaldo } = authSlice.actions;
export default authSlice.reducer;
