import { createSlice } from "@reduxjs/toolkit";

const assetSlice = createSlice({
  name: "asset",
  initialState: {
    selectedAsset: "bitcoin",
    currentPrice: null,
  },
  reducers: {
    setSelectedAsset: (state, action) => {
      state.selectedAsset = action.payload;
    },
    setCurrentPrice: (state, action) => {
      state.currentPrice = action.payload;
    },
  },
});

export const { setSelectedAsset, setCurrentPrice } = assetSlice.actions;
export default assetSlice.reducer;
