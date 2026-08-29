"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function BalanceDetails() {
  const [pendingFromCompanies, setPendingFromCompanies] = useState(0);
  const [balanceToDrivers, setBalanceToDrivers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from("trips")
        .select("balance_from_company, driver_balance");

      if (data) {
        let fromCompanies = 0;
        let toDrivers = 0;
        for (const row of data) {
          fromCompanies += Number(row.balance_from_company) || 0;
          toDrivers += Number(row.driver_balance) || 0;
        }
        setPendingFromCompanies(fromCompanies);
        setBalanceToDrivers(toDrivers);
      }
      setLoading(false);
    }
    load();
  }, []);

  const inr = (n: number) => `₹ ${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
    <div>
      <h2 className="font-display font-bold text-xl mb-3">Balance Details</h2>
      {loading ? (
        <p className="text-slate text-sm">Loading…</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="ledger-card p-5">
            <div className="field-label">Pending from Companies</div>
            <div className="stat-number text-2xl font-bold mt-1 text-deficit">
              {inr(pendingFromCompanies)}
            </div>
            <div className="text-xs text-slate mt-1">All-time outstanding</div>
          </div>
          <div className="ledger-card p-5">
            <div className="field-label">Balance to be Paid to Drivers</div>
            <div className="stat-number text-2xl font-bold mt-1 text-deficit">
              {inr(balanceToDrivers)}
            </div>
            <div className="text-xs text-slate mt-1">All-time outstanding</div>
          </div>
        </div>
      )}
    </div>
  );
}
