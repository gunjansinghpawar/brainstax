"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  roles?: string[]; // NEW: allowed roles
}

export default function AuthGuard({ children, roles }: AuthGuardProps) {
  const { user, token, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Not logged in
    if (!isAuthenticated || !user || !token) {
      router.replace("/login");
      return;
    }

    // First login
    if (user.isFirstLogin) {
      router.replace("/change-password");
      return;
    }

    // Role check (only if roles are provided)
    if (roles && roles.length > 0) {
      if (!user.role || !roles.includes(user.role)) {
        router.replace("/unauthorized"); // or dashboard, anything you prefer
        return;
      }
    }
  }, [isAuthenticated, user, token, roles, router]);

  // Don’t render content until checks finish
  if (
    !isAuthenticated ||
    !user ||
    !token ||
    user.isFirstLogin ||
    (roles && roles.length > 0 && (!user.role || !roles.includes(user.role)))
  ) {
    return null;
  }

  return <>{children}</>;
}
