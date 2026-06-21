"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { mapProfileRowToProfile } from "@/lib/api";
import { ShortlistActionSchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rate-limit";

export async function addShortlist(shortlistedProfileId: string) {
  const allowed = await checkRateLimit({ action: 'add_shortlist', limit: 30, window: 60 });
  if (!allowed) return { error: "Rate limit exceeded. Please try again later." };

  const parsed = ShortlistActionSchema.parse({ shortlistedProfileId });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to shortlist profiles." };
  }

  const { error } = await supabase
    .from("shortlists")
    .insert({
      user_id: user.id,
      shortlisted_profile_id: parsed.shortlistedProfileId,
    });

  if (error) {
    console.error("Error adding to shortlist:", error);
    if (error.code === '23505') {
       return { error: "Profile is already shortlisted." };
    }
    return { error: "Failed to shortlist profile." };
  }

  revalidatePath("/search");
  revalidatePath("/dashboard");
  revalidatePath("/shortlists");
  
  return { success: true };
}

export async function removeShortlist(shortlistedProfileId: string) {
  const allowed = await checkRateLimit({ action: 'remove_shortlist', limit: 30, window: 60 });
  if (!allowed) return { error: "Rate limit exceeded. Please try again later." };

  const parsed = ShortlistActionSchema.parse({ shortlistedProfileId });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to remove shortlists." };
  }

  const { error } = await supabase
    .from("shortlists")
    .delete()
    .match({
      user_id: user.id,
      shortlisted_profile_id: parsed.shortlistedProfileId,
    });

  if (error) {
    console.error("Error removing from shortlist:", error);
    return { error: "Failed to remove shortlist." };
  }

  revalidatePath("/search");
  revalidatePath("/dashboard");
  revalidatePath("/shortlists");

  return { success: true };
}

export async function getShortlistIds() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { ids: [] };
  }

  const { data, error } = await supabase
    .from("shortlists")
    .select("shortlisted_profile_id")
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching shortlist ids:", error);
    return { ids: [] };
  }

  return { ids: data.map(s => s.shortlisted_profile_id) };
}

export async function getShortlistedProfiles() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { profiles: [] };
  }

  // Optimized query: join shortlists with profiles and galleries in one go
  const { data, error } = await supabase
    .from("shortlists")
    .select(`
      created_at,
      profiles:shortlisted_profile_id (
        *,
        galleries ( image_url )
      )
    `)
    .eq("user_id", user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching shortlisted profiles:", error);
    return { profiles: [] };
  }

  const profiles = data
    .filter(item => item.profiles) // Ensure profile exists
    .map(item => mapProfileRowToProfile(item.profiles));

  return { profiles };
}
