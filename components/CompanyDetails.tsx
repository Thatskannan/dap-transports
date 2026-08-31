"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type CompanyStat = {
  name: string;
  pending: number;
};

export default function CompanyDetails({ refreshKey }: { refreshKey: number }) {
  const [companies, setCompanies] = useState<CompanyStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from("trips")
        .select("company_name, balance_from_company, company_paid");

      if (data) {
        const map = new Map<string, number>();
        for (const row of data) {
          const name = row.company_name;
          if (!name) continue;
          const pending = row.company_paid ? 0 : Number(row.balance_from_company) || 0;
          map.set(name, (map.get(name) || 0) + pending);
        }
        const list = Array.from(map.entries())
          .map(([name, pending]) => ({ name, pending }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCompanies(list);
      }
      setLoading(false);
    }
    load();
  }, [refreshKey]);

  const inr = (n: number) => `₹ ${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
    <div>
      <h2 className="font-display font-bold text-xl mb-3">Company Details</h2>
      {loading ? (
        <p className="text-slate text-sm">Loading…</p>
      ) : companies.length === 0 ? (
        <div className="ledger-card p-6 text-center text-slate text-sm">
          No company entries yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {companies.map((c) => (
            <div key={c.name} className="ledger-card p-4">
              <div className="field-label truncate">{c.name}</div>
              {c.pending > 0 ? (
                <div className="stat-number text-lg font-bold mt-1 text-deficit">
                  {inr(c.pending)}
                </div>
              ) : (
                <div className="stat-number text-lg font-bold mt-1 text-profit">Paid up</div>
              )}
              <div className="text-xs text-slate mt-0.5">Balance to be paid</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
