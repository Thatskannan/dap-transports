"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Trip } from "@/lib/types";
import DriverDetails from "@/components/DriverDetails";
import BalanceDetails from "@/components/BalanceDetails";
import CompanyDetails from "@/components/CompanyDetails";

function monthOptions() {
  const opts: { value: string; label: string }[] = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("en-IN", { month: "long", year: "numeric" });
    opts.push({ value, label });
  }
  return opts;
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: "profit" | "deficit" | "signal";
}) {
  const color =
    accent === "profit" ? "text-profit" : accent === "deficit" ? "text-deficit" : accent === "signal" ? "text-signal" : "text-asphalt";
  return (
    <div className="ledger-card p-5">
      <div className="field-label">{label}</div>
      <div className={`stat-number text-2xl font-bold mt-1 ${color}`}>{value}</div>
    </div>
  );
}

export default function ReportsPage() {
  const options = useMemo(monthOptions, []);
  const [month, setMonth] = useState(options[0].value);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [y, m] = month.split("-").map(Number);
      const start = `${month}-01`;
      const endDate = new Date(y, m, 0).getDate();
      const end = `${month}-${String(endDate).padStart(2, "0")}`;

      const { data } = await supabase
        .from("trips")
        .select("*")
        .gte("trip_date", start)
        .lte("trip_date", end)
        .order("trip_date", { ascending: true });

      setTrips((data as Trip[]) ?? []);
      setLoading(false);
    }
    load();
  }, [month, refreshKey]);

  async function togglePaid(id: string, paid: boolean) {
    setTrips((prev) => prev.map((t) => (t.id === id ? { ...t, company_paid: paid } : t)));
    const { error } = await supabase.from("trips").update({ company_paid: paid }).eq("id", id);
    if (error) {
      // revert on failure
      setTrips((prev) => prev.map((t) => (t.id === id ? { ...t, company_paid: !paid } : t)));
      return;
    }
    setRefreshKey((k) => k + 1);
  }

  const totals = useMemo(() => {
    return trips.reduce(
      (acc, t) => {
        acc.trips += 1;
        acc.rent += Number(t.rent) || 0;
        acc.received += Number(t.advance_from_company) || 0;
        acc.pendingFromCompany += Number(t.balance_from_company) || 0;
        acc.driverSalary += Number(t.driver_salary) || 0;
        acc.driverAdvance += Number(t.driver_advance) || 0;
        acc.diesel += Number(t.diesel_cost) || 0;
        acc.fasttag += Number(t.fasttag) || 0;
        acc.netProfit += Number(t.net_profit) || 0;
        return acc;
      },
      {
        trips: 0,
        rent: 0,
        received: 0,
        pendingFromCompany: 0,
        driverSalary: 0,
        driverAdvance: 0,
        diesel: 0,
        fasttag: 0,
        netProfit: 0,
      }
    );
  }, [trips]);

  const totalExpense = totals.driverSalary + totals.diesel + totals.fasttag;
  const inr = (n: number) => `₹ ${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;

  return (
    <div className="flex flex-col gap-10">
      <DriverDetails refreshKey={refreshKey} />

      <CompanyDetails refreshKey={refreshKey} />

      <BalanceDetails refreshKey={refreshKey} />

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-display font-bold text-2xl">Monthly Report</h2>
          <select
            className="border border-asphalt/15 rounded px-3 py-2 text-sm font-mono bg-white"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            {options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

      {loading ? (
        <p className="text-slate text-sm">Loading…</p>
      ) : trips.length === 0 ? (
        <div className="ledger-card p-6 text-center text-slate text-sm">
          No trips logged for this month.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard label="Total Trips" value={String(totals.trips)} />
            <StatCard label="Total Business (Rent)" value={inr(totals.rent)} accent="signal" />
            <StatCard label="Received from Companies" value={inr(totals.received)} />
            <StatCard label="Total Driver Salary" value={inr(totals.driverSalary)} />
            <StatCard label="Advance Paid to Drivers" value={inr(totals.driverAdvance)} />
            <StatCard label="Total Diesel Cost" value={inr(totals.diesel)} />
            <StatCard label="Total FASTag" value={inr(totals.fasttag)} />
            <StatCard label="Total Expense" value={inr(totalExpense)} accent="deficit" />
            <StatCard
              label="Net Profit"
              value={inr(totals.netProfit)}
              accent={totals.netProfit >= 0 ? "profit" : "deficit"}
            />
          </div>

          <div className="ledger-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-asphalt text-paper text-left">
                  <th className="px-3 py-2 field-label !text-paper/70">#</th>
                  <th className="px-3 py-2 field-label !text-paper/70">Date</th>
                  <th className="px-3 py-2 field-label !text-paper/70">Vehicle</th>
                  <th className="px-3 py-2 field-label !text-paper/70">Company</th>
                  <th className="px-3 py-2 field-label !text-paper/70 text-right">Rent</th>
                  <th className="px-3 py-2 field-label !text-paper/70 text-right">Balance</th>
                  <th className="px-3 py-2 field-label !text-paper/70 text-right">Diesel</th>
                  <th className="px-3 py-2 field-label !text-paper/70 text-right">Driver Salary</th>
                  <th className="px-3 py-2 field-label !text-paper/70 text-right">Net Profit</th>
                  <th className="px-3 py-2 field-label !text-paper/70 text-center">Paid</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((t, i) => (
                  <tr key={t.id} className={i % 2 ? "bg-asphalt/5" : ""}>
                    <td className="px-3 py-2 font-mono text-slate">{i + 1}</td>
                    <td className="px-3 py-2 font-mono whitespace-nowrap">{t.trip_date}</td>
                    <td className="px-3 py-2 font-mono whitespace-nowrap">{t.vehicle_number}</td>
                    <td className="px-3 py-2">{t.company_name}</td>
                    <td className="px-3 py-2 font-mono text-right">{inr(Number(t.rent))}</td>
                    <td className="px-3 py-2 font-mono text-right text-deficit">
                      {t.company_paid ? "—" : inr(Number(t.balance_from_company))}
                    </td>
                    <td className="px-3 py-2 font-mono text-right">{inr(Number(t.diesel_cost))}</td>
                    <td className="px-3 py-2 font-mono text-right">{inr(Number(t.driver_salary))}</td>
                    <td
                      className={`px-3 py-2 font-mono text-right font-bold ${
                        Number(t.net_profit) >= 0 ? "text-profit" : "text-deficit"
                      }`}
                    >
                      {inr(Number(t.net_profit))}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={t.company_paid}
                        onChange={(e) => togglePaid(t.id, e.target.checked)}
                        title="Mark company balance as fully paid"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      </div>
    </div>
  );
}
