# Folder Structure

This document outlines the folder structure of the Gokul Vivaham project.

```text
Gokul-Vivaham/
├── app/                  # Next.js App Router root
│   ├── admin/            # Admin dashboard routes
│   ├── dashboard/        # User dashboard
│   ├── interests/        # Sent/Received interests
│   ├── login/            # Authentication: Login
│   ├── messages/         # Realtime Chat interface
│   ├── profile/          # Profile creation, editing, and viewing
│   ├── register/         # Authentication: Registration
│   ├── search/           # Advanced search interface
│   ├── shortlists/       # User shortlists
│   ├── subscription/     # Razorpay payment and plans
│   ├── error.tsx         # Global error boundary
│   ├── layout.tsx        # Root layout (SEO, Fonts, Layout wrapper)
│   ├── loading.tsx       # Global loading state
│   ├── not-found.tsx     # Custom 404 page
│   ├── page.tsx          # Landing page
│   ├── robots.ts         # SEO: Robots configuration
│   └── sitemap.ts        # SEO: Dynamic sitemap
├── components/           # Reusable React components
│   ├── chat/             # Chat UI components
│   ├── home/             # Landing page components
│   └── ui/               # Generic UI components (Cards, Buttons, etc.)
├── docs/                 # Project documentation
├── lib/                  # Shared utility functions and constants
├── public/               # Static assets (images, fonts, icons)
├── supabase/             # Supabase configuration, migrations, and SQL functions
├── types/                # TypeScript type definitions
└── utils/                # Helper utilities (e.g., Supabase server/client creation)
```
