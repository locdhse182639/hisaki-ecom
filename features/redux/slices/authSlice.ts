import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isVerified: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  isVerified: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ token: string; user: AuthState["user"] }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    registerSuccess: (
      state,
      action: PayloadAction<{ token: string; user: AuthState["user"] }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.isVerified = false;
    },
    verifyEmailSuccess: (state) => {
      state.isVerified = true;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["token", "user"],
};

export const { loginSuccess, registerSuccess, logout } = authSlice.actions;
export default persistReducer(persistConfig, authSlice.reducer);
