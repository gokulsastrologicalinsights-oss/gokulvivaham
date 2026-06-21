# Environment Variables Setup

This guide documents all required environment variables for Gokul Vivaham.

## Local Development
Create a `.env.local` file in the root directory:

```env
# NEXT.JS CONFIG
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# SUPABASE CONFIG
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# SUPABASE SERVICE ROLE (KEEP SECRET)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# RAZORPAY CONFIG
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## Production Environment
In Vercel (or your hosting provider), ensure the following are securely set:
- Change `NEXT_PUBLIC_SITE_URL` to your production domain (e.g., `https://gokulvivaham.com`).
- Use the production Razorpay keys instead of test keys.
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is completely hidden and not leaked to the frontend.
