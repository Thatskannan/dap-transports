"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type DriverStat = {
  name: string;
  totalSalary: number;
  lastSalary: number;
};

export default function DriverDetails() {
  const [drivers, setDrivers] = useState<DriverStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from("trips")
        .select("driver_name, driver_salary, trip_date")
        .order("trip_date", { ascending: true });

      if (data) {
        const map = new Map<string, DriverStat>();
        for (const row of data) {
          const name = row.driver_name;
          if (!name) continue;
          const existing = map.get(name);
          const salary = Number(row.driver_salary) || 0;
          if (existing) {
            existing.totalSalary += salary;
            existing.lastSalary = salary; // rows are ascending by date, so last write wins
          } else {
            map.set(name, { name, totalSalary: salary, lastSalary: salary });
          }
        }
        setDrivers(Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name)));
      }
      setLoading(false);
    }
    load();
  }, []);

  const inr = (n: number) => `₹ ${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
    <div>
      <h2 className="font-display font-bold text-xl mb-3">Driver Details</h2>
      {loading ? (
        <p className="text-slate text-sm">Loading…</p>
      ) : drivers.length === 0 ? (
        <div className="ledger-card p-6 text-center text-slate text-sm">
          No driver entries yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {drivers.map((d) => (
            <div key={d.name} className="ledger-card p-4">
              <div className="field-label truncate">{d.name}</div>
              <div className="stat-number text-lg font-bold mt-1">
                {inr(d.totalSalary)}
              </div>
              <div className="text-xs text-slate mt-0.5">Total salary so far</div>
              <div className="stat-number text-xs text-deficit mt-2">
                Last: {inr(d.lastSalary)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
