"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const inputClass =
  "border border-asphalt/15 rounded px-3 py-2 text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-signal focus:border-signal";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.replace("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-5">
      <form onSubmit={handleSubmit} className="ledger-card p-8 w-full max-w-sm flex flex-col gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl">
            DAP <span className="text-signal">Transports</span>
          </h1>
          <p className="text-slate text-sm mt-1">Sign in to view the trip ledger</p>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="field-label">Email</span>
          <input
            required
            type="email"
            autoComplete="email"
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="field-label">Password</span>
          <input
            required
            type="password"
            autoComplete="current-password"
            className={inputClass}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        {error && <p className="text-deficit text-sm font-mono">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-signal text-asphalt font-display font-bold px-6 py-2.5 rounded hover:brightness-95 disabled:opacity-50 transition"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
    </div>
  );
}
