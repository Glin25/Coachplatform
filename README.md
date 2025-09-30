# Coaching Platform Application

A comprehensive web application for coaching businesses with role-based access for clients and coaches.

## Features

### For Clients:
- Daily wellness check-ins tracking energy, stress, mood, sleep, and focus
- Personal goals management across business, health, and relationships categories
- Weekly reflection system with guided questions
- Interactive trends dashboard with data visualization
- Progress tracking and goal monitoring

### For Coaches:
- Client list with overview and key metrics
- Detailed client views with comprehensive data
- Session notes and documentation
- Tasks and reminders system
- Automated alerts for clients needing attention
- Data visualization and trend analysis

## Setup

### Database Setup

The application requires a Supabase database. The migration SQL is available in `MIGRATION_SQL.sql`.

To apply the migration:
1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Copy the contents of `MIGRATION_SQL.sql`
4. Run the SQL to create all tables and security policies

### Running the Application

```bash
npm install
npm run dev
```

The application will be available at http://localhost:5173

## Technology Stack

- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Supabase for authentication and database
- React Router for navigation
- Recharts for data visualization
- Lucide React for icons

## User Roles

### Client
- Can register and log in
- Access their own dashboard with check-ins, goals, and reflections
- View personal trends and progress

### Coach
- Can register and log in as a coach
- View all clients and their data
- Add session notes
- Create tasks and reminders
- View automated alerts

## Security

- Row Level Security (RLS) enabled on all tables
- Clients can only access their own data
- Coaches can view all client data but cannot modify client-entered information
- Secure authentication via Supabase Auth

## Project Structure

```
src/
├── lib/              # Core libraries (Supabase client, auth, types)
├── contexts/         # React contexts (AuthContext)
├── components/
│   ├── auth/        # Login and registration pages
│   ├── client/      # Client dashboard and features
│   └── coach/       # Coach dashboard and features
└── App.tsx          # Main application with routing
```

## Notes

- The application is fully responsive and works on mobile, tablet, and desktop
- All data is persisted in Supabase
- Authentication is handled securely via Supabase Auth
- The UI follows modern design principles with clean, professional aesthetics

## Database Migration Status

⚠️ **IMPORTANT**: The database migration needs to be applied before the application will function properly. 
The migration file `MIGRATION_SQL.sql` is ready and contains all necessary tables, indexes, and security policies.

Once the Supabase service is available, run the migration to activate all features.
