"use client";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function RoleBasedRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    const checkRedirect = async () => {
      const res = await fetch("/api/auth/redirect-check");
      const data = await res.json();
      router.replace(data.redirect);
    };

    if (status === "authenticated") {
      checkRedirect();
    }
  }, [status, router]);

  return null; // Or loading spinner
}
