"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { deleteTrip } from "@/lib/tripActions";
import type { Trip } from "@/lib/types";

const inputClass =
  "border border-asphalt/15 rounded px-3 py-2 text-sm bg-paper focus:outline-none focus:ring-2 focus:ring-signal focus:border-signal";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="field-label">{label}</span>
      {children}
    </label>
  );
}

export default function EditTripModal({
  trip,
  onClose,
  onChanged,
}: {
  trip: Trip;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [form, setForm] = useState({
    trip_date: trip.trip_date,
    vehicle_number: trip.vehicle_number,
    company_name: trip.company_name,
    destination_from: trip.destination_from,
    destination_to: trip.destination_to,
    rent: String(trip.rent),
    advance_from_company: String(trip.advance_from_company),
    driver_name: trip.driver_name,
    driver_salary: String(trip.driver_salary),
    driver_advance: String(trip.driver_advance),
    diesel_cost: String(trip.diesel_cost),
    fasttag: String(trip.fasttag),
    company_paid: trip.company_paid,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const num = (v: string) => (v === "" ? 0 : parseFloat(v) || 0);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const { error } = await supabase
      .from("trips")
      .update({
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
        company_paid: form.company_paid,
      })
      .eq("id", trip.id);
    setSaving(false);
    if (error) {
      setError(error.message);
      return;
    }
    onChanged();
    onClose();
  }

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    const { error } = await deleteTrip(trip.id);
    setDeleting(false);
    if (error) {
      setError(error.message);
      return;
    }
    onChanged();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-asphalt/60 flex items-center justify-center p-4 z-50">
      <form
        onSubmit={handleSave}
        className="ledger-card p-6 flex flex-col gap-5 w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl">Edit Trip</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate hover:text-asphalt text-sm font-mono"
          >
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Date">
            <input required type="date" className={inputClass} value={form.trip_date} onChange={set("trip_date")} />
          </Field>
          <Field label="Vehicle Number">
            <input required className={inputClass} value={form.vehicle_number} onChange={set("vehicle_number")} />
          </Field>
          <Field label="Company Name">
            <input required className={inputClass} value={form.company_name} onChange={set("company_name")} />
          </Field>
          <Field label="Driver Name">
            <input required className={inputClass} value={form.driver_name} onChange={set("driver_name")} />
          </Field>
          <Field label="Destination From">
            <input required className={inputClass} value={form.destination_from} onChange={set("destination_from")} />
          </Field>
          <Field label="Destination To">
            <input required className={inputClass} value={form.destination_to} onChange={set("destination_to")} />
          </Field>
          <Field label="Rent (₹)">
            <input required type="number" step="0.01" className={inputClass} value={form.rent} onChange={set("rent")} />
          </Field>
          <Field label="Advance from Company (₹)">
            <input type="number" step="0.01" className={inputClass} value={form.advance_from_company} onChange={set("advance_from_company")} />
          </Field>
          <Field label="Driver Salary (₹)">
            <input type="number" step="0.01" className={inputClass} value={form.driver_salary} onChange={set("driver_salary")} />
          </Field>
          <Field label="Advance to Driver (₹)">
            <input type="number" step="0.01" className={inputClass} value={form.driver_advance} onChange={set("driver_advance")} />
          </Field>
          <Field label="Diesel Cost (₹)">
            <input type="number" step="0.01" className={inputClass} value={form.diesel_cost} onChange={set("diesel_cost")} />
          </Field>
          <Field label="FASTag (₹)">
            <input type="number" step="0.01" className={inputClass} value={form.fasttag} onChange={set("fasttag")} />
          </Field>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.company_paid}
            onChange={(e) => setForm((f) => ({ ...f, company_paid: e.target.checked }))}
          />
          Company balance fully paid
        </label>

        {error && <p className="text-deficit text-sm font-mono">{error}</p>}

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-asphalt/10">
          {confirmDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-deficit text-xs font-mono">Delete this trip?</span>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="text-deficit font-bold text-sm underline"
              >
                {deleting ? "Deleting…" : "Confirm delete"}
              </button>
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="text-slate text-sm"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="text-deficit text-sm font-mono hover:underline"
            >
              Delete Trip
            </button>
          )}

          <button
            type="submit"
            disabled={saving}
            className="bg-signal text-asphalt font-display font-bold px-5 py-2 rounded hover:brightness-95 disabled:opacity-50 transition"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
