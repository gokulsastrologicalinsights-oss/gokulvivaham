# Installation Guide

Follow these steps to set up the Gokul Vivaham project locally.

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- A Supabase account and project
- A Razorpay account (for payment gateway integration)

## Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Gokul-Vivaham
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy the example environment file and fill in the values:
   ```bash
   cp .env.example .env.local
   ```
   *See [Environment Variables](ENVIRONMENT_VARIABLES.md) for details.*

4. **Initialize Supabase**
   - Push the database schema to your Supabase project (see [Database Migrations](DATABASE_MIGRATIONS.md)).
   - Set up the Storage buckets (`avatars`, `gallery`, `documents`).

5. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
