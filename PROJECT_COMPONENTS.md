# Schedule Table Manager - Component Implementation

## Project Structure

```
schedule-table-manager/
├── .env.local                    # Environment variables (for local development)
├── .gitignore                    # Git ignore file
├── README.md                     # Project readme
├── package.json                  # Project dependencies
├── tsconfig.json                 # TypeScript configuration
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── schedule/
│   │   │       ├── route.ts      # GET (all entries), POST (new entry)
│   │   │       └── [id]/
│   │   │           └── route.ts  # GET, PUT, DELETE specific entry
│   │   ├── favicon.ico           # Favicon
│   │   ├── globals.css           # Global styles
│   │   ├── layout.tsx            # Root layout
│   │   └── page.tsx              # Main application page
│   ├── components/
│   │   ├── EntryForm.tsx         # Form for adding new entries
│   │   ├── ScheduleTable.tsx     # Table to display schedule entries
│   │   ├── TableCell.tsx         # Individual table cell component
│   │   └── ScheduleEntry.tsx     # Component for displaying an entry in a cell
│   ├── lib/
│   │   ├── supabase.ts           # Supabase client configuration
│   │   ├── types.ts              # TypeScript type definitions
│   │   └── utils.ts              # Utility functions
│   └── hooks/
│       └── useScheduleData.ts    # Custom hook for fetching/manipulating schedule data
└── public/
    └── assets/                   # Public assets
```

## Key Component Files

### 1. src/app/layout.tsx

```tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Schedule Table Manager',
  description: 'Manage and visualize schedule entries in a table format',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

### 2. src/app/page.tsx

```tsx
import EntryForm from '@/components/EntryForm';
import ScheduleTable from '@/components/ScheduleTable';
import { createClient } from '@/lib/supabase';

export default async function Home() {
  const supabase = createClient();
  
  // Fetch initial data server-side
  const { data: scheduleEntries } = await supabase
    .from('schedule_entries')
    .select('*');

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-6">Schedule Table Manager</h1>
      <EntryForm />
      <ScheduleTable initialData={scheduleEntries || []} />
    </main>
  );
}
```

### 3. src/components/EntryForm.tsx

```tsx
'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { ScheduleEntry } from '@/lib/types';

export default function EntryForm() {
  const [formData, setFormData] = useState<Partial<ScheduleEntry>>({
    title: '',
    person: '',
    context: '',
    day: '',
    type: '',
    time_slot: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.title || !formData.person || !formData.context || 
        !formData.day || !formData.type || !formData.time_slot) {
      alert('Please fill all required fields');
      return;
    }
    
    const supabase = createClient();
    const { error } = await supabase.from('schedule_entries').insert([formData]);
    
    if (error) {
      console.error('Error adding entry:', error);
      alert('Error adding entry');
    } else {
      // Reset form
      setFormData({
        title: '',
        person: '',
        context: '',
        day: '',
        type: '',
        time_slot: '',
      });
      // Trigger page refresh to show new data
      window.location.reload();
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-6">
      <div className="mb-2">
        <span className="text-purple-600">💠 Data embeds automatically - use Ctrl+S or "Save As" to save HTML with your current schedule</span>
      </div>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="person" className="block text-sm font-medium">
            Person <span className="text-red-500">*</span>
          </label>
          <select
            id="person"
            value={formData.person}
            onChange={(e) => setFormData({...formData, person: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Select Person</option>
            <option value="Nilson">Nilson</option>
            <option value="Louis">Louis</option>
            <option value="Jaden">Jaden</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="context" className="block text-sm font-medium">
            Context <span className="text-red-500">*</span>
          </label>
          <select
            id="context"
            value={formData.context}
            onChange={(e) => setFormData({...formData, context: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Select Context</option>
            <option value="SSCPMR testing">SSCPMR testing</option>
            <option value="EMS Migration">EMS Migration</option>
            <option value="Team Activities">Team Activities</option>
            <option value="Training">Training</option>
            <option value="Software Demo">Software Demo</option>
            <option value="Documentation">Documentation</option>
            <option value="Management">Management</option>
            <option value="Security">Security</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Development">Development</option>
            <option value="Reporting">Reporting</option>
            <option value="Certification">Certification</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="day" className="block text-sm font-medium">
            Day <span className="text-red-500">*</span>
          </label>
          <select
            id="day"
            value={formData.day}
            onChange={(e) => setFormData({...formData, day: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Select Day</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="TBD">TBD</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="type" className="block text-sm font-medium">
            Type <span className="text-red-500">*</span>
          </label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => setFormData({...formData, type: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Select Type</option>
            <option value="Meeting">Meeting</option>
            <option value="Task">Task</option>
            <option value="Reminder">Reminder</option>
            <option value="KPI">KPI</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="time_slot" className="block text-sm font-medium">
            Time Slot <span className="text-red-500">*</span>
          </label>
          <select
            id="time_slot"
            value={formData.time_slot}
            onChange={(e) => setFormData({...formData, time_slot: e.target.value})}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            <option value="">Select Time Slot</option>
            <option value="Reminder">Reminder</option>
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
        
        <div className="md:col-span-5">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Add Entry
          </button>
        </div>
      </form>
    </div>
  );
}
```

### 4. src/components/ScheduleTable.tsx

```tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { ScheduleEntry } from '@/lib/types';
import TableCell from './TableCell';

interface ScheduleTableProps {
  initialData: ScheduleEntry[];
}

export default function ScheduleTable({ initialData }: ScheduleTableProps) {
  const [entries, setEntries] = useState<ScheduleEntry[]>(initialData);
  
  // Subscribe to changes
  useEffect(() => {
    const supabase = createClient();
    
    const channel = supabase
      .channel('table-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'schedule_entries' },
        (payload) => {
          // Refresh data when there's a change
          fetchEntries();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  const fetchEntries = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('schedule_entries').select('*');
    if (data) setEntries(data);
  };
  
  // Get unique persons from entries
  const persons = Array.from(new Set(entries.map(entry => entry.person))).sort();
  
  // Days as column headers
  const days = ['1', '2', '3', '4', '5', 'TBD'];
  
  // Time slots
  const timeSlots = ['Reminder', 'AM', 'PM'];
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 bg-gray-700 text-white p-2">Person</th>
            <th className="border border-gray-300 bg-gray-700 text-white p-2">Context</th>
            {days.map((day) => (
              <th key={day} className="border border-gray-300 bg-gray-700 text-white p-2">{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {persons.map((person) => (
            // For each person, create rows for each time slot
            timeSlots.map((timeSlot, index) => (
              <tr key={`${person}-${timeSlot}`}>
                {/* Person column - only show for the first time slot of each person */}
                {index === 0 ? (
                  <td rowSpan={3} className="border border-gray-300 bg-gray-600 text-white p-2 text-center align-middle">{person}</td>
                ) : null}
                
                {/* Time slot column */}
                <td className={`border border-gray-300 ${
                  timeSlot === 'Reminder' ? 'bg-gray-400' : 
                  timeSlot === 'AM' ? 'bg-gray-400' : 'bg-gray-400'
                } p-2 text-center`}>
                  {timeSlot}
                </td>
                
                {/* Day columns */}
                {days.map((day) => (
                  <TableCell 
                    key={`${person}-${timeSlot}-${day}`}
                    entries={entries.filter(
                      entry => 
                        entry.person === person && 
                        entry.time_slot === timeSlot && 
                        entry.day === day
                    )}
                  />
                ))}
              </tr>
            ))
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### 5. src/components/TableCell.tsx

```tsx
import { ScheduleEntry } from '@/lib/types';
import { getBackgroundColorByType } from '@/lib/utils';

interface TableCellProps {
  entries: ScheduleEntry[];
}

export default function TableCell({ entries }: TableCellProps) {
  return (
    <td className="border border-gray-300 p-2 min-w-[200px] align-top">
      {entries.length > 0 ? (
        <div className="flex flex-col gap-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`p-2 rounded ${getBackgroundColorByType(entry.type)}`}
            >
              {entry.title}
            </div>
          ))}
        </div>
      ) : null}
    </td>
  );
}
```

### 6. src/lib/types.ts

```tsx
export interface ScheduleEntry {
  id: string;
  title: string;
  person: string;
  context: string;
  day: string;
  type: string;
  time_slot: string;
  created_at: string;
  updated_at: string;
}
```

### 7. src/lib/utils.ts

```tsx
export const getBackgroundColorByType = (type: string): string => {
  switch (type) {
    case 'Meeting':
      return 'bg-purple-500 text-white';
    case 'Task':
      return 'bg-blue-500 text-white';
    case 'Reminder':
      return 'bg-yellow-500';
    case 'KPI':
      return 'bg-gray-700 text-white';
    default:
      return 'bg-green-500 text-white';
  }
};
```

### 8. src/lib/supabase.ts

```tsx
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const createClient = () => {
  return createSupabaseClient(supabaseUrl, supabaseKey);
};
```

### 9. src/app/api/schedule/route.ts

```tsx
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET() {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('schedule_entries')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('schedule_entries')
    .insert([body])
    .select();
    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data[0]);
}
```

### 10. src/app/api/schedule/[id]/route.ts

```tsx
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  const { id } = params;
  
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('schedule_entries')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }
  
  return NextResponse.json(data);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = params;
  const body = await request.json();
  
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('schedule_entries')
    .update(body)
    .eq('id', id)
    .select();
    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json(data[0]);
}

export async function DELETE(request: NextRequest, { params }: Params) {
  const { id } = params;
  
  const supabase = createClient();
  
  const { error } = await supabase
    .from('schedule_entries')
    .delete()
    .eq('id', id);
    
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ success: true });
}
```

### 11. package.json

```json
{
  "name": "schedule-table-manager",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.38.0",
    "next": "14.0.0",
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10",
    "eslint": "^8",
    "eslint-config-next": "14.0.0",
    "postcss": "^8",
    "tailwindcss": "^3",
    "typescript": "^5"
  }
}
```

### 12. .env.local (example)

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 13. next.config.js

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig;
```

### 14. tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### 15. postcss.config.js

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### 16. src/app/globals.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 0, 0, 0;
  --background-start-rgb: 255, 255, 255;
  --background-end-rgb: 255, 255, 255;
}

body {
  color: rgb(var(--foreground-rgb));
  background: linear-gradient(
      to bottom,
      transparent,
      rgb(var(--background-end-rgb))
    )
    rgb(var(--background-start-rgb));
}
```

## Setup and Deployment

### Setting up Supabase

1. Create a new project on [Supabase](https://supabase.com)
2. In the SQL editor, run the SQL commands from the `SUPABASE_SCHEMA.sql` file
3. Get your project URL and anon key from the API settings

### Local Development

1. Clone your GitHub repository:
   ```bash
   git clone https://github.com/leisureSG99/weeklyScheduler.git
   cd weeklyScheduler
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view the application

### Deploying to Vercel

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. Connect your GitHub repository to Vercel:
   - Log in to [Vercel](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Configure the project:
     - Framework Preset: Next.js
     - Add environment variables (same as in `.env.local`)
   - Click "Deploy"

3. Your application will be deployed and accessible at a Vercel URL 