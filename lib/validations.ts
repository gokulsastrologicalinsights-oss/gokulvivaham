import { z } from "zod";
import DOMPurify from "isomorphic-dompurify";

// Helper to sanitize strings to prevent XSS
export const sanitizeString = (str: string) => DOMPurify.sanitize(str);

// General ID schema
export const UUIDSchema = z.string().uuid("Invalid UUID format");

// Admin Actions Schemas
export const UpdateUserStatusSchema = z.object({
  userId: UUIDSchema,
  status: z.enum(["active", "suspended", "deleted"]),
});

export const ResolveReportSchema = z.object({
  reportId: UUIDSchema,
  resolution: z.enum(["resolved", "dismissed"]),
  notes: z.string().optional().transform((val) => val ? sanitizeString(val) : val),
});

export const ModerateGalleryImageSchema = z.object({
  imageId: UUIDSchema,
  status: z.enum(["approved", "rejected"]),
});

export const ModerateVerificationSchema = z.object({
  verificationId: UUIDSchema,
  profileId: UUIDSchema,
  status: z.enum(["approved", "rejected"]),
  notes: z.string().optional().transform((val) => val ? sanitizeString(val) : val),
});

export const DeleteSuccessStorySchema = z.object({
  storyId: UUIDSchema,
});

// User Actions Schemas
export const NotificationActionSchema = z.object({
  notificationId: UUIDSchema,
});

export const ProfileViewSchema = z.object({
  viewedUserId: UUIDSchema,
});

export const ShortlistActionSchema = z.object({
  shortlistedProfileId: UUIDSchema,
});
