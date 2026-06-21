-- supabase/migrations/20260621190000_production_indexes.sql

-- ==========================================
-- PERFORMANCE INDEXES FOR PRODUCTION
-- ==========================================

-- Optimized indexes for feed/pagination queries sorted by created_at DESC
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_created_at_desc ON public.profiles(created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_interests_created_at_desc ON public.interests(created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_shortlists_created_at_desc ON public.shortlists(created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_messages_created_at_desc ON public.messages(created_at DESC);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notifications_created_at_desc ON public.notifications(created_at DESC);

-- Optimized index for queries that filter by location
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_location_city ON public.profiles(location_city);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_location_state ON public.profiles(location_state);

-- Optimized index for finding primary gallery images quickly
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_galleries_profile_primary ON public.galleries(profile_id, is_primary);
