"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import TripForm from "@/components/TripForm";
import TripList from "@/components/TripList";
import type { Trip } from "@/lib/types";

export default function Home() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTrips = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("trips")
      .select("*")
      .order("trip_date", { ascending: false })
      .limit(20);
    setTrips((data as Trip[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  return (
    <div className="flex flex-col gap-8">
      <TripForm onSaved={loadTrips} />

      <div>
        <h2 className="font-display font-bold text-xl mb-3">Recent Trips</h2>
        {loading ? (
          <p className="text-slate text-sm">Loading…</p>
        ) : (
          <TripList trips={trips} onChanged={loadTrips} />
        )}
      </div>
    </div>
  );
}
