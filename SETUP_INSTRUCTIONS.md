# Setup Instructions for Schedule Table Manager

This document provides step-by-step instructions to set up and deploy the Schedule Table Manager application.

## Prerequisites

- Node.js 18.x or later
- npm or yarn
- GitHub account
- Supabase account (free tier)
- Vercel account (for deployment)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/leisureSG99/weeklyScheduler.git
cd weeklyScheduler
```

### 2. Create Next.js Project

```bash
# Initialize a new Next.js project with TypeScript, App Router, and Tailwind CSS
npx create-next-app@latest . --typescript --eslint --app --tailwind --src-dir
```

### 3. Install Additional Dependencies

```bash
npm install @supabase/supabase-js
```

### 4. Create Project Structure

Create the following directory structure:

```
src/
├── app/
│   ├── api/
│   │   └── schedule/
│   │       ├── route.ts
│   │       └── [id]/
│   │           └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── EntryForm.tsx
│   ├── ScheduleTable.tsx
│   └── TableCell.tsx
└── lib/
    ├── supabase.ts
    ├── types.ts
    └── utils.ts
```

### 5. Set Up Supabase

1. Create a new project at [Supabase](https://supabase.com)
2. After creating your project, go to the SQL editor
3. Copy the contents of the `SUPABASE_SCHEMA.sql` file
4. Paste and run the SQL in the Supabase SQL editor
5. Go to Project Settings > API to get your project URL and anon key

### 6. Configure Environment Variables

Create a `.env.local` file in the project root with the following content:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Replace `your_supabase_project_url` and `your_supabase_anon_key` with the values from your Supabase project settings.

### 7. Start the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application running.

## Code Implementation

1. Copy the code from the `PROJECT_COMPONENTS.md` file to implement each component
2. The file contains all the necessary code for:
   - API routes
   - UI components
   - Supabase integration
   - TypeScript types
   - Utility functions

## Deployment to Vercel

### 1. Push Your Code to GitHub

```bash
git add .
git commit -m "Initial implementation of Schedule Table Manager"
git push origin main
```

### 2. Deploy with Vercel

1. Log in to [Vercel](https://vercel.com)
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: `./` (if you're deploying from the repository root)
   - Environment Variables: Add the same variables from your `.env.local` file
5. Click "Deploy"

### 3. Access Your Deployed Application

After deployment is complete, Vercel will provide a URL where your application is accessible.

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Double-check your Supabase URL and anon key
   - Make sure the environment variables are correctly set in Vercel

2. **Form Styling Issues**:
   - If input fields aren't styled correctly, you may need to install `@tailwindcss/forms` and add it to your `tailwind.config.js`

3. **Real-time Updates Not Working**:
   - Check if your Supabase project has real-time functionality enabled

## Next Steps

- Implement entry editing functionality
- Add entry deletion
- Improve mobile responsiveness
- Add user authentication
- Add data export functionality 