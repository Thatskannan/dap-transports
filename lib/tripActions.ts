import { supabase } from "@/lib/supabaseClient";

export async function deleteTrip(id: string) {
  const { error } = await supabase.from("trips").delete().eq("id", id);
  return { error };
}
