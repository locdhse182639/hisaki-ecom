import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import browsingHistoryReducer from "./slices/browsingHistorySlice";
import cartReducer from "./slices/cartSlice";
import authReducer from "./slices/authSlice";


// Combine reducers (future-proof for additional slices)
const rootReducer = combineReducers({
  browsingHistory: browsingHistoryReducer,
  cart: cartReducer,
  auth: authReducer,
});

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["browsingHistory", "cart", "auth"], // Persist browsingHistory and cart slices
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
// Type for the dispatch function used in the application
export type AppDispatch = typeof store.dispatch;
