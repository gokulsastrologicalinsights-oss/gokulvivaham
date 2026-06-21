CREATE TABLE public.rate_limits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  action text NOT NULL,
  identifier text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX idx_rate_limits_lookup ON public.rate_limits (action, identifier, created_at);

ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- No read/write policies for public. Only service role or security definer functions can access.

CREATE OR REPLACE FUNCTION public.check_rate_limit(
  action_name text,
  req_identifier text,
  limit_count int,
  window_seconds int
) RETURNS boolean AS $$
DECLARE
  current_count int;
BEGIN
  -- Clean up old records to prevent table bloat (optional, could be a cron job, but doing it here for simplicity)
  DELETE FROM public.rate_limits 
  WHERE action = action_name 
    AND identifier = req_identifier 
    AND created_at < timezone('utc'::text, now()) - (window_seconds || ' seconds')::interval;

  -- Count requests in the current window
  SELECT count(*)
  INTO current_count
  FROM public.rate_limits
  WHERE action = action_name
    AND identifier = req_identifier
    AND created_at >= timezone('utc'::text, now()) - (window_seconds || ' seconds')::interval;

  IF current_count >= limit_count THEN
    RETURN false;
  END IF;

  -- Log the new request
  INSERT INTO public.rate_limits (action, identifier)
  VALUES (action_name, req_identifier);

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
