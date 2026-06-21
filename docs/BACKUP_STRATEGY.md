# Backup & Disaster Recovery Strategy

To ensure data integrity and high availability, follow this backup strategy for the Gokul Vivaham platform.

## 1. Automated Backups (Supabase PITR)
For production projects, upgrade your Supabase plan to enable **Point-in-Time Recovery (PITR)**.
- PITR allows restoring the database to any specific minute within the retention period (usually 7-30 days).
- It runs automatically in the background without performance impact.

## 2. Manual Daily Dumps (Recommended)
As a secondary safeguard, schedule daily complete database dumps:
```bash
pg_dump --clean --if-exists --quote-all-identifiers \
 -h aws-0-[REGION].pooler.supabase.com -U postgres.[PROJECT-REF] \
 > daily_backup_$(date +%Y%m%d).sql
```
Store these dumps securely in AWS S3 or Google Cloud Storage.

## 3. Storage Backups (User Photos & Docs)
User uploaded galleries and verification documents are stored in Supabase Storage.
- Write a cron job using the Supabase CLI to periodically pull files from the `galleries` and `chat-images` buckets to a secondary cold storage (e.g. AWS S3 Glacier).

## 4. Disaster Recovery Procedure
If complete data loss occurs:
1. Spin up a new Supabase project.
2. Run the latest `.sql` database dump.
3. Re-upload all assets from your secondary cold storage to the Supabase buckets.
4. Update Vercel environment variables with the new Supabase credentials.
