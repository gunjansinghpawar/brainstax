import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "@/types/auth";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
}

const getInitialUser = () => {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const getInitialToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

const initialState: AuthState = {
  user: getInitialUser(),
  token: getInitialToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    /* ----------------------------------------
     * SET FULL AUTH (login)
     * ---------------------------------------- */
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },

    /* ----------------------------------------
     * UPDATE USER ONLY (profile update)
     * ---------------------------------------- */
    setUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;

      localStorage.setItem("user", JSON.stringify(action.payload));
    },

    /* ----------------------------------------
     * LOGOUT
     * ---------------------------------------- */
    logout: (state) => {
      state.user = null;
      state.token = null;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
