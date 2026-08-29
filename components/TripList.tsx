"use client";

import type { Trip } from "@/lib/types";

export default function TripList({ trips }: { trips: Trip[] }) {
  if (trips.length === 0) {
    return (
      <div className="ledger-card p-6 text-center text-slate text-sm">
        No trips logged yet. Fill the form above to add your first entry.
      </div>
    );
  }

  return (
    <div className="ledger-card overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-asphalt text-paper text-left">
            <th className="px-3 py-2 field-label !text-paper/70">Date</th>
            <th className="px-3 py-2 field-label !text-paper/70">Vehicle</th>
            <th className="px-3 py-2 field-label !text-paper/70">Company</th>
            <th className="px-3 py-2 field-label !text-paper/70">Route</th>
            <th className="px-3 py-2 field-label !text-paper/70">Driver</th>
            <th className="px-3 py-2 field-label !text-paper/70 text-right">Rent</th>
            <th className="px-3 py-2 field-label !text-paper/70 text-right">Net Profit</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((t, i) => (
            <tr key={t.id} className={i % 2 ? "bg-asphalt/5" : ""}>
              <td className="px-3 py-2 font-mono whitespace-nowrap">{t.trip_date}</td>
              <td className="px-3 py-2 font-mono whitespace-nowrap">{t.vehicle_number}</td>
              <td className="px-3 py-2">{t.company_name}</td>
              <td className="px-3 py-2 whitespace-nowrap">
                {t.destination_from} → {t.destination_to}
              </td>
              <td className="px-3 py-2">{t.driver_name}</td>
              <td className="px-3 py-2 font-mono text-right">₹{Number(t.rent).toFixed(0)}</td>
              <td
                className={`px-3 py-2 font-mono text-right font-bold ${
                  Number(t.net_profit) >= 0 ? "text-profit" : "text-deficit"
                }`}
              >
                ₹{Number(t.net_profit).toFixed(0)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
