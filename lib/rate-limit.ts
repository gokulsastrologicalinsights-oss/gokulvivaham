import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";

interface RateLimitConfig {
  action: string;
  limit: number;
  window: number; // in seconds
}

export async function checkRateLimit({ action, limit, window }: RateLimitConfig): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Determine identifier: Use user ID if logged in, otherwise try to use IP address
  let identifier = user?.id;

  if (!identifier) {
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");
    identifier = forwardedFor ? forwardedFor.split(",")[0].trim() : (realIp || "anonymous");
  }

  const { data: allowed, error } = await supabase.rpc("check_rate_limit", {
    action_name: action,
    req_identifier: identifier,
    limit_count: limit,
    window_seconds: window,
  });

  if (error) {
    console.error("Rate limit check failed:", error);
    // Fail open or fail closed? Usually fail closed for security, but fail open for availability.
    // Let's fail closed if it's a security-critical action, but for now we'll throw an error to prevent the action.
    throw new Error("Rate limiting service unavailable");
  }

  return allowed as boolean;
}
