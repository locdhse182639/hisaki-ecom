import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import browsingHistoryReducer from "./slices/browsingHistorySlice";

// Combine reducers (future-proof for additional slices)
const rootReducer = combineReducers({
  browsingHistory: browsingHistoryReducer,
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["browsingHistory"], // Only persist browsingHistory slice
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for redux-persist
    }),
});

// Export the persistor
export const persistor = persistStore(store);

// Infer types for hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
