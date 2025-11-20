import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./services/authApi";
import { companyApi } from "./services/companyApi";
import { usersApi } from "./services/usersApi";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,

    // RTK Query reducers
    [authApi.reducerPath]: authApi.reducer,
    [companyApi.reducerPath]: companyApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer, // <-- ADDED
  },

  middleware: (getDefault) =>
    getDefault().concat(
      authApi.middleware,
      companyApi.middleware,
      usersApi.middleware // <-- ADDED
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
