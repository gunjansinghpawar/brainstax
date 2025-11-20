"use client";

import { useAppSelector } from "@/lib/store/hooks";

export const useAuth = () => {
  const { user, token } = useAppSelector((state) => state.auth);
  const isAuthenticated = Boolean(user && token);

  return { user, token, isAuthenticated };
};
