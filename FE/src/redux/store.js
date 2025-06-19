import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./slices/authSlice";
import newsReducer from "./slices/newsSlice";
import dashboardReducer from "./slices/dashboardSlice";
import movimentiReducer from "./slices/movimentiSlice";
import mutuoReducer from "./slices/mutuoSlice";
import prestitiReducer from "./slices/prestitiSlice";
import investimentiReducer from "./slices/investimentiSlice";
import graficiReducer from "./slices/graficiSlice";
import geoReducer from "./slices/geoSlice";
import assetReducer from "./slices/assetSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  news: newsReducer,
  dashboard: dashboardReducer,
  movimenti: movimentiReducer,
  mutuo: mutuoReducer,
  prestiti: prestitiReducer,
  investimenti: investimentiReducer,
  grafici: graficiReducer,
  geografia: geoReducer,
  asset: assetReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
export const persistor = persistStore(store);
