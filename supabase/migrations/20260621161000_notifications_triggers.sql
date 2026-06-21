-- supabase/migrations/20260621161000_notifications_triggers.sql

-- ==========================================
-- 1. PROFILE VIEWS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profile_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  viewer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  viewed_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(viewer_id, viewed_id) -- Only record the first view or use this to avoid spam
);

-- RLS for profile_views
ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own views" ON public.profile_views FOR INSERT WITH CHECK (auth.uid() = viewer_id);
CREATE POLICY "Users can see who viewed them" ON public.profile_views FOR SELECT USING (auth.uid() = viewed_id);

-- ==========================================
-- 2. NOTIFICATION TRIGGERS
-- ==========================================

-- Function to handle new interests
CREATE OR REPLACE FUNCTION public.handle_new_interest()
RETURNS TRIGGER AS $$
DECLARE
  sender_name TEXT;
BEGIN
  SELECT first_name INTO sender_name FROM public.profiles WHERE id = NEW.sender_id;
  
  INSERT INTO public.notifications (user_id, type, content, reference_id)
  VALUES (
    NEW.receiver_id,
    'interest_received',
    COALESCE(sender_name, 'Someone') || ' sent you an interest.',
    NEW.id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_interest_received
  AFTER INSERT ON public.interests
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_interest();

-- Function to handle interest accepted
CREATE OR REPLACE FUNCTION public.handle_interest_accepted()
RETURNS TRIGGER AS $$
DECLARE
  receiver_name TEXT;
BEGIN
  IF NEW.status = 'accepted' AND OLD.status != 'accepted' THEN
    SELECT first_name INTO receiver_name FROM public.profiles WHERE id = NEW.receiver_id;
    
    INSERT INTO public.notifications (user_id, type, content, reference_id)
    VALUES (
      NEW.sender_id,
      'interest_accepted',
      COALESCE(receiver_name, 'Someone') || ' accepted your interest.',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_interest_accepted
  AFTER UPDATE ON public.interests
  FOR EACH ROW EXECUTE FUNCTION public.handle_interest_accepted();

-- Function to handle new message
CREATE OR REPLACE FUNCTION public.handle_new_message()
RETURNS TRIGGER AS $$
DECLARE
  receiver_id UUID;
  sender_name TEXT;
BEGIN
  -- Find the other participant in the chat
  SELECT 
    CASE 
      WHEN participant1_id = NEW.sender_id THEN participant2_id 
      ELSE participant1_id 
    END INTO receiver_id
  FROM public.chats 
  WHERE id = NEW.chat_id;

  SELECT first_name INTO sender_name FROM public.profiles WHERE id = NEW.sender_id;

  INSERT INTO public.notifications (user_id, type, content, reference_id)
  VALUES (
    receiver_id,
    'message_received',
    'New message from ' || COALESCE(sender_name, 'someone') || '.',
    NEW.chat_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_new_message
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_message();

-- Function to handle profile view
CREATE OR REPLACE FUNCTION public.handle_profile_view()
RETURNS TRIGGER AS $$
DECLARE
  viewer_name TEXT;
BEGIN
  SELECT first_name INTO viewer_name FROM public.profiles WHERE id = NEW.viewer_id;
  
  INSERT INTO public.notifications (user_id, type, content, reference_id)
  VALUES (
    NEW.viewed_id,
    'profile_viewed',
    COALESCE(viewer_name, 'Someone') || ' viewed your profile.',
    NEW.viewer_id
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_viewed
  AFTER INSERT ON public.profile_views
  FOR EACH ROW EXECUTE FUNCTION public.handle_profile_view();

-- Function to handle subscription updates
CREATE OR REPLACE FUNCTION public.handle_subscription_update()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.notifications (user_id, type, content, reference_id)
    VALUES (
      NEW.profile_id,
      'system',
      'Your subscription to ' || NEW.plan_name || ' is now active.',
      NEW.id
    );
  ELSIF TG_OP = 'UPDATE' AND NEW.status != OLD.status THEN
    INSERT INTO public.notifications (user_id, type, content, reference_id)
    VALUES (
      NEW.profile_id,
      'system',
      'Your subscription status changed to ' || NEW.status || '.',
      NEW.id
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_subscription_update
  AFTER INSERT OR UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_subscription_update();

-- ==========================================
-- ENABLE REALTIME FOR NOTIFICATIONS
-- ==========================================
-- Ensure notifications are broadcasted
alter publication supabase_realtime add table public.notifications;
