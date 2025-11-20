import { createApi } from "@reduxjs/toolkit/query/react";
import { BACKEND_URL } from "@/URLS";
import { baseQueryWithAuth } from "../baseQuery";

export const api = createApi({
  reducerPath: "api",

  baseQuery: baseQueryWithAuth(BACKEND_URL), // 🔥 GLOBAL AUTH + COOKIES

  tagTypes: ["Users", "Companies", "Auth"],

  endpoints: () => ({}), // empty, other APIs will inject endpoints
});
