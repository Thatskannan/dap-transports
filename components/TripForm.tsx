"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { TripFormInput } from "@/lib/types";

type Suggestions = {
  vehicles: string[];
  companies: string[];
  drivers: string[];
};

const emptySuggestions: Suggestions = { vehicles: [], companies: [], drivers: [] };

function unique(values: (string | null)[]) {
  return Array.from(new Set(values.filter((v): v is string => !!v && v.trim() !== "")));
}

const emptyForm: TripFormInput = {
  trip_date: new Date().toISOString().slice(0, 10),
  vehicle_number: "",
  company_name: "",
  destination_from: "",
  destination_to: "",
  rent: "",
  advance_from_company: "",
  driver_name: "",
  driver_salary: "",
  driver_advance: "",
  diesel_cost: "",
  fasttag: "",
};

const num = (v: string) => (v === "" ? 0 : parseFloat(v) || 0);

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="field-label">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "border border-asphalt/15 rounded px-3 py-2 text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-signal focus:border-signal";

export default function TripForm({ onSaved }: { onSaved?: () => void }) {
  const [form, setForm] = useState<TripFormInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestions>(emptySuggestions);

  async function loadSuggestions() {
    const { data } = await supabase
      .from("trips")
      .select("vehicle_number, company_name, driver_name");
    if (!data) return;
    setSuggestions({
      vehicles: unique(data.map((d) => d.vehicle_number)),
      companies: unique(data.map((d) => d.company_name)),
      drivers: unique(data.map((d) => d.driver_name)),
    });
  }

  useEffect(() => {
    loadSuggestions();
  }, []);

  const set = (key: keyof TripFormInput) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const balanceFromCompany = useMemo(
    () => num(form.rent) - num(form.advance_from_company),
    [form.rent, form.advance_from_company]
  );
  const driverBalance = useMemo(
    () => num(form.driver_salary) - num(form.driver_advance),
    [form.driver_salary, form.driver_advance]
  );
  const netProfit = useMemo(
    () =>
      num(form.rent) - num(form.driver_salary) - num(form.diesel_cost) - num(form.fasttag),
    [form.rent, form.driver_salary, form.diesel_cost, form.fasttag]
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    const { error } = await supabase.from("trips").insert({
      trip_date: form.trip_date,
      vehicle_number: form.vehicle_number,
      company_name: form.company_name,
      destination_from: form.destination_from,
      destination_to: form.destination_to,
      rent: num(form.rent),
      advance_from_company: num(form.advance_from_company),
      driver_name: form.driver_name,
      driver_salary: num(form.driver_salary),
      driver_advance: num(form.driver_advance),
      diesel_cost: num(form.diesel_cost),
      fasttag: num(form.fasttag),
    });

    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSuccess(true);
    setForm({ ...emptyForm, trip_date: form.trip_date });
    loadSuggestions();
    onSaved?.();
  }

  return (
    <form onSubmit={handleSubmit} className="ledger-card p-6 flex flex-col gap-6">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display font-bold text-xl">New Trip Entry</h2>
        {success && (
          <span className="text-profit text-xs font-mono">Saved ✓</span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Date">
          <input required type="date" className={inputClass} value={form.trip_date} onChange={set("trip_date")} />
        </Field>
        <Field label="Vehicle Number">
          <input
            required
            list="vehicle-options"
            placeholder="TN 39 AB 1234"
            className={inputClass}
            value={form.vehicle_number}
            onChange={set("vehicle_number")}
          />
          <datalist id="vehicle-options">
            {suggestions.vehicles.map((v) => (
              <option key={v} value={v} />
            ))}
          </datalist>
        </Field>
        <Field label="Company Name">
          <input
            required
            list="company-options"
            placeholder="Client / consignor"
            className={inputClass}
            value={form.company_name}
            onChange={set("company_name")}
          />
          <datalist id="company-options">
            {suggestions.companies.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </Field>
        <Field label="Driver Name">
          <input
            required
            list="driver-options"
            className={inputClass}
            value={form.driver_name}
            onChange={set("driver_name")}
          />
          <datalist id="driver-options">
            {suggestions.drivers.map((d) => (
              <option key={d} value={d} />
            ))}
          </datalist>
        </Field>
        <Field label="Destination From">
          <input required className={inputClass} value={form.destination_from} onChange={set("destination_from")} />
        </Field>
        <Field label="Destination To">
          <input required className={inputClass} value={form.destination_to} onChange={set("destination_to")} />
        </Field>
      </div>

      <div className="h-px bg-asphalt/10" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Rent for Transporting Goods (₹)">
          <input required type="number" min="0" step="0.01" className={inputClass} value={form.rent} onChange={set("rent")} />
        </Field>
        <Field label="Advance Paid by Company (₹)">
          <input type="number" min="0" step="0.01" className={inputClass} value={form.advance_from_company} onChange={set("advance_from_company")} />
        </Field>
        <Field label="Driver Total Salary (₹)">
          <input type="number" min="0" step="0.01" className={inputClass} value={form.driver_salary} onChange={set("driver_salary")} />
        </Field>
        <Field label="Advance Paid to Driver (₹)">
          <input type="number" min="0" step="0.01" className={inputClass} value={form.driver_advance} onChange={set("driver_advance")} />
        </Field>
        <Field label="Diesel Cost (₹)">
          <input type="number" min="0" step="0.01" className={inputClass} value={form.diesel_cost} onChange={set("diesel_cost")} />
        </Field>
        <Field label="FASTag (₹)">
          <input type="number" min="0" step="0.01" className={inputClass} value={form.fasttag} onChange={set("fasttag")} />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-asphalt/5 rounded p-4">
        <div>
          <div className="field-label">Balance from Company</div>
          <div className="stat-number text-lg font-bold">₹ {balanceFromCompany.toFixed(2)}</div>
        </div>
        <div>
          <div className="field-label">Balance to Driver</div>
          <div className="stat-number text-lg font-bold">₹ {driverBalance.toFixed(2)}</div>
        </div>
        <div>
          <div className="field-label">Estimated Net Profit</div>
          <div className={`stat-number text-lg font-bold ${netProfit >= 0 ? "text-profit" : "text-deficit"}`}>
            ₹ {netProfit.toFixed(2)}
          </div>
        </div>
      </div>

      {error && <p className="text-deficit text-sm font-mono">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="self-start bg-signal text-asphalt font-display font-bold px-6 py-2.5 rounded hover:brightness-95 disabled:opacity-50 transition"
      >
        {saving ? "Saving…" : "Save Trip"}
      </button>
    </form>
  );
}
