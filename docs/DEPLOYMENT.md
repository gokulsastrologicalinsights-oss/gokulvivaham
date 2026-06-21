# Deployment Guide

The recommended hosting provider for Next.js applications is Vercel. Supabase handles the database and backend services.

## 1. Deploying to Vercel

1. **Push your code to a Git repository** (GitHub, GitLab, or Bitbucket).
2. **Import Project to Vercel**:
   - Log in to [Vercel](https://vercel.com).
   - Click "Add New..." -> "Project".
   - Import your repository.
3. **Configure Environment Variables**:
   - In the "Environment Variables" section, add all variables defined in `docs/ENVIRONMENT_VARIABLES.md`.
4. **Deploy**:
   - Click "Deploy". Vercel will build and deploy your application.

## 2. Production Database Setup

Ensure your production Supabase project has the correct schema applied. Refer to `docs/DATABASE_MIGRATIONS.md` to migrate your schema.

### Auth Domain Configuration

If you add a custom domain in Vercel (e.g., `gokulvivaham.com`), you must add this domain to your Supabase Auth configuration:
1. Go to your Supabase Project -> Authentication -> URL Configuration.
2. Under "Site URL", enter your production URL.
3. Under "Redirect URLs", add your production URL and auth callback routes (e.g., `https://gokulvivaham.com/auth/callback`).

### Razorpay Webhooks

If you implemented webhooks for Razorpay:
1. Add the webhook URL in the Razorpay Dashboard (e.g., `https://gokulvivaham.com/api/webhooks/razorpay`).
2. Add the `RAZORPAY_WEBHOOK_SECRET` to your Vercel Environment Variables.
