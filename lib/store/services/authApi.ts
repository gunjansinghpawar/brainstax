import { createApi } from "@reduxjs/toolkit/query/react";
import type {
  LoginRequest,
  LoginSuccessResponse,
  ChangePasswordRequest,
  ChangePasswordSuccess,
} from "@/types/auth";
import { BACKEND_URL } from "@/URLS";
import { baseQueryWithAuth } from "../baseQuery";

export const authApi = createApi({
  reducerPath: "authApi",

  baseQuery: baseQueryWithAuth(`${BACKEND_URL}/auth`),

  endpoints: (builder) => ({
    login: builder.mutation<LoginSuccessResponse, LoginRequest>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),

    changePassword: builder.mutation<
      ChangePasswordSuccess,
      ChangePasswordRequest
    >({
      query: (body) => ({
        url: "/change-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useLoginMutation, useChangePasswordMutation } = authApi;
