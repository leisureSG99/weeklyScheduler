# Schedule Table Manager

A web application for managing and visualizing schedule entries in a structured table format.

## Features

- Add schedule entries with details (title, person, context, day, type)
- Display schedule entries in a structured table format
- Group entries by person and time slot (Reminder, AM, PM)
- Visual distinction between different entry types

## Tech Stack

- **Frontend/Backend Framework**: Next.js with App Router
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel via GitHub

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Supabase account (for database)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/leisureSG99/weeklyScheduler.git
   cd weeklyScheduler
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the project root with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Database Setup

1. Create a new project in Supabase.
2. Create a table named `schedule_entries` with the following schema:
   - `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
   - `title` (Text, Not Null)
   - `person` (Text, Not Null)
   - `context` (Text, Not Null)
   - `day` (Text, Not Null)
   - `type` (Text, Not Null)
   - `time_slot` (Text, Not Null)
   - `created_at` (Timestamp with Time Zone, Default: `now()`)
   - `updated_at` (Timestamp with Time Zone, Default: `now()`)

## Deployment

This project is configured for easy deployment on Vercel:

1. Push your code to GitHub.
2. Import the project in Vercel.
3. Configure the environment variables in the Vercel dashboard.
4. Deploy!

## License

This project is licensed under the MIT License. 