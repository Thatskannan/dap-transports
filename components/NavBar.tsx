"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const isReports = pathname === "/reports";

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setLoggedIn(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setLoggedIn(!!session);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  if (pathname === "/login") return null;

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header className="bg-asphalt text-paper">
      <div className="h-1 bg-route-line" />
      <nav className="max-w-5xl mx-auto flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          {isReports && (
            <Link
              href="/"
              aria-label="Back to trip form"
              className="text-paper/80 hover:text-signal transition text-xl leading-none"
            >
              ←
            </Link>
          )}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display font-bold text-lg tracking-tight">
              DAP <span className="text-signal">Transports</span>
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/reports"
            className="font-mono text-xs uppercase tracking-widest border border-paper/30 rounded px-3 py-1.5 hover:bg-paper/10 transition"
          >
            Reports
          </Link>
          {loggedIn && (
            <button
              onClick={handleSignOut}
              className="font-mono text-xs uppercase tracking-widest text-paper/60 hover:text-signal transition"
            >
              Sign out
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
