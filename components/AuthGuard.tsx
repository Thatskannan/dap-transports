"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecked(true);
      if (!data.session && pathname !== "/login") router.replace("/login");
      if (data.session && pathname === "/login") router.replace("/");
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (!newSession && pathname !== "/login") router.replace("/login");
      if (newSession && pathname === "/login") router.replace("/");
    });

    return () => sub.subscription.unsubscribe();
  }, [pathname, router]);

  if (pathname === "/login") return <>{children}</>;
  if (!checked) return <p className="text-slate text-sm">Loading…</p>;
  if (!session) return null;

  return <>{children}</>;
}
