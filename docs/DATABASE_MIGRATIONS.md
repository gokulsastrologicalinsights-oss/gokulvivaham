# Database Migrations

This project uses the Supabase CLI to manage database migrations and schema changes.

## Prerequisites

Install the Supabase CLI:
```bash
npm install -g supabase
```

Ensure you are logged in to the CLI:
```bash
supabase login
```

## Migration Workflow

### 1. Link your project
Link your local repository to your remote Supabase project:
```bash
supabase link --project-ref <your-project-ref>
```

### 2. Pull remote changes (Optional)
If changes were made directly in the Supabase UI, pull them into a local migration:
```bash
supabase db pull
```

### 3. Create a new migration
To create a new migration manually:
```bash
supabase migration new my_feature_name
```
This creates a new `.sql` file in `supabase/migrations/`. Edit this file with your SQL commands.

### 4. Push migrations to remote
Apply your local migrations to the remote database:
```bash
supabase db push
```

## Important Database Indexes

For performance optimization in production, ensure the following indexes exist:

```sql
-- Example indexes for optimization
CREATE INDEX idx_profiles_user_id ON profiles(id);
CREATE INDEX idx_profiles_gender ON profiles(gender);
CREATE INDEX idx_shortlists_user_id ON shortlists(user_id);
CREATE INDEX idx_interests_sender_id ON interests(sender_id);
CREATE INDEX idx_interests_receiver_id ON interests(receiver_id);
CREATE INDEX idx_messages_room_id ON messages(room_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
```
