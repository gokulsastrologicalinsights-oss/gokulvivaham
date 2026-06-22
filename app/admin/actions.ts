"use server"

import { revalidatePath } from 'next/cache'
import { checkRateLimit } from '@/lib/rate-limit'
import { createClient } from '@/utils/supabase/server'
import {
  UpdateUserStatusSchema,
  ResolveReportSchema,
  ModerateGalleryImageSchema,
  ModerateVerificationSchema,
  DeleteSuccessStorySchema
} from '@/lib/validations'

// Ensure the caller is an authenticated admin
async function requireAdmin() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    throw new Error("Unauthorized")
  }

  // Check admin role from app_metadata or by calling the is_admin RPC/checking a user_roles table if it exists.
  // In our SQL migrations, `public.is_admin()` uses `auth.jwt() ->> 'role' = 'admin'` or similar.
  // We can also query `is_admin` via RPC:
  const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin')
  
  if (adminError)
    throw new Error("Admin verification failed")

  if (!isAdmin)
    throw new Error("Unauthorized")

  return user
}

// User Management Actions
export async function updateUserStatus(userId: string, status: 'active' | 'suspended' | 'deleted') {
  await requireAdmin()
  const allowed = await checkRateLimit({ action: 'admin_update_user', limit: 20, window: 60 })
  if (!allowed) throw new Error("Rate limit exceeded")

  const parsed = UpdateUserStatusSchema.parse({ userId, status })

  const supabase = await createClient()
  const { error } = await supabase.from('profiles').update({ status: parsed.status }).eq('id', parsed.userId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/users')
}

// Report Management Actions
export async function resolveReport(reportId: string, resolution: 'resolved' | 'dismissed', notes?: string) {
  await requireAdmin()
  const allowed = await checkRateLimit({ action: 'admin_resolve_report', limit: 20, window: 60 })
  if (!allowed) throw new Error("Rate limit exceeded")

  const parsed = ResolveReportSchema.parse({ reportId, resolution, notes })

  const supabase = await createClient()
  const { error } = await supabase
    .from('reports')
    .update({ 
      status: parsed.resolution,
      admin_notes: parsed.notes 
    })
    .eq('id', parsed.reportId)
  
  if (error) throw new Error(error.message)
  revalidatePath('/admin/reports')
}

// Gallery Moderation Actions
export async function moderateGalleryImage(imageId: string, status: 'approved' | 'rejected') {
  await requireAdmin()
  const allowed = await checkRateLimit({ action: 'admin_moderate_gallery', limit: 50, window: 60 })
  if (!allowed) throw new Error("Rate limit exceeded")

  const parsed = ModerateGalleryImageSchema.parse({ imageId, status })

  const supabase = await createClient()
  const { error } = await supabase.from('galleries').update({ status: parsed.status }).eq('id', parsed.imageId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/gallery')
}

// Verification Actions
export async function moderateVerification(verificationId: string, profileId: string, status: 'approved' | 'rejected', notes?: string) {
  await requireAdmin()
  const allowed = await checkRateLimit({ action: 'admin_moderate_verification', limit: 20, window: 60 })
  if (!allowed) throw new Error("Rate limit exceeded")

  const parsed = ModerateVerificationSchema.parse({ verificationId, profileId, status, notes })

  const supabase = await createClient()
  
  const { error } = await supabase
    .from('verification_requests')
    .update({ status: parsed.status, notes: parsed.notes })
    .eq('id', parsed.verificationId)

  if (error) throw new Error(error.message)

  if (parsed.status === 'approved') {
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ is_verified: true })
      .eq('id', parsed.profileId)
    
    if (profileError) throw new Error(profileError.message)
  }

  revalidatePath('/admin/verifications')
}

// Success Stories Actions
export async function deleteSuccessStory(storyId: string) {
  await requireAdmin()
  const allowed = await checkRateLimit({ action: 'admin_delete_story', limit: 20, window: 60 })
  if (!allowed) throw new Error("Rate limit exceeded")

  const parsed = DeleteSuccessStorySchema.parse({ storyId })

  const supabase = await createClient()
  const { error } = await supabase.from('success_stories').delete().eq('id', parsed.storyId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin/success-stories')
}
