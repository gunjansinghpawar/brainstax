"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/store/hooks";

export default function Home() {
  const router = useRouter();
  const { user, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (user && token) {
      router.replace("/dashboard");
    } else {
      router.replace("/login");
    }
  }, [user, token, router]);

  return null; // No UI needed — auto redirect
}
