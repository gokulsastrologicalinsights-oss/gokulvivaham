"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { NotificationActionSchema, ProfileViewSchema } from "@/lib/validations";
import { checkRateLimit } from "@/lib/rate-limit";

export async function markNotificationAsRead(notificationId: string) {
  const allowed = await checkRateLimit({ action: 'mark_notification_read', limit: 30, window: 60 });
  if (!allowed) throw new Error("Rate limit exceeded");

  const parsed = NotificationActionSchema.parse({ notificationId });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", parsed.notificationId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error marking notification as read:", error);
    throw new Error("Failed to mark as read");
  }

  revalidatePath("/");
  return { success: true };
}

export async function markAllNotificationsAsRead() {
  const allowed = await checkRateLimit({ action: 'mark_all_notifications_read', limit: 10, window: 60 });
  if (!allowed) throw new Error("Rate limit exceeded");

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user.id)
    .eq("is_read", false);

  if (error) {
    console.error("Error marking all notifications as read:", error);
    throw new Error("Failed to mark all as read");
  }

  revalidatePath("/");
  return { success: true };
}

export async function recordProfileView(viewedUserId: string) {
  const allowed = await checkRateLimit({ action: 'record_profile_view', limit: 100, window: 60 });
  if (!allowed) return { success: false }; // Fail silently for analytics

  const parsed = ProfileViewSchema.parse({ viewedUserId });

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.id === parsed.viewedUserId) {
    return { success: false };
  }

  // @ts-ignore
  const { error } = await supabase
    .from("profile_views")
    .insert({
      viewer_user_id: user.id,
      viewed_user_id: parsed.viewedUserId,
    });

  if (error) {
    console.log("Profile view not recorded (possibly duplicate):", error.message);
  }

  return { success: true };
}
