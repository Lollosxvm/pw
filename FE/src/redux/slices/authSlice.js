import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  utente: null,
  accessToken: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.utente = action.payload.utente;
      state.accessToken = action.payload.token;
      state.loading = false;
    },
    logout: (state) => {
      state.utente = null;
      state.accessToken = null;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setAuth, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
