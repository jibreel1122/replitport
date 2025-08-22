# Jibreel Bornat Portfolio

## Supabase Database Setup

### 1. Create a Supabase Project
1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the project to be fully provisioned
3. Go to Settings > Database and copy your connection string

### 2. Configure Environment Variables
Update your `.env` file with your Supabase credentials:

```env
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

### 3. Run Database Migration
Execute the initial schema migration:

```bash
# Apply the migration to your Supabase database
npm run db:push
```

### 4. Verify Setup
- Check your Supabase dashboard to ensure all tables are created
- Verify RLS policies are enabled
- Test the connection by running the development server

## Database Schema

### Tables
- **sessions**: Authentication session storage
- **users**: User profiles from Replit authentication
- **projects**: Portfolio projects with bilingual content (English/Arabic)
- **contact_messages**: Contact form submissions

### Security
- Row Level Security (RLS) enabled on all user-facing tables
- Public read access for projects
- Authenticated access for admin operations
- Public insert access for contact messages

## Development

```bash
# Start development server
npm run dev

# Push schema changes to database
npm run db:push
```

## Features
- ✅ Supabase PostgreSQL database
- ✅ Bilingual support (English/Arabic)
- ✅ Row Level Security
- ✅ Authentication with Replit
- ✅ Admin panel for project management
- ✅ Contact form with message storage