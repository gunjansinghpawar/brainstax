import { fetchBaseQuery } from "@reduxjs/toolkit/query";

export const baseQueryWithAuth = (baseUrl: string) =>
  fetchBaseQuery({
    baseUrl,

    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          console.log("GLOBAL AUTH HEADER SET:", token);
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  });
