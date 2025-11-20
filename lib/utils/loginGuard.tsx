"use client";

import { useAppSelector } from "@/lib/store/hooks";
import { redirect } from "next/navigation";

export default function LoginGuard({ children }: { children: React.ReactNode }) {
  const user = useAppSelector((state) => state.auth.user);

  if (user) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
