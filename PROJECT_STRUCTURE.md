# Schedule Table Manager - Project Structure

## Project Overview
A Next.js application for managing and visualizing schedule data in a table format, using Supabase for database management. The application allows users to add schedule entries through a form and displays them in a table grouped by person, time slot, and day.

## Tech Stack
- **Frontend/Backend Framework**: Next.js 14+ with App Router
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel via GitHub

## Directory Structure

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

## Database Schema (Supabase)

### Table: schedule_entries
- `id` (UUID, Primary Key)
- `title` (Text, Not Null)
- `person` (Text, Not Null) - e.g., "Nilson", "Louis", "Jaden"
- `context` (Text, Not Null) - e.g., "SSCPMR testing", "EMS Migration"
- `day` (Text, Not Null) - e.g., "1", "2", "3", "4", "5", "TBD"
- `type` (Text, Not Null) - e.g., "Meeting", "Task", "Reminder"
- `time_slot` (Text, Not Null) - e.g., "Reminder", "AM", "PM"
- `created_at` (Timestamp with Time Zone, Default: now())
- `updated_at` (Timestamp with Time Zone, Default: now())

## Key Files and Components

### 1. src/app/page.tsx
Main application page containing both the EntryForm and ScheduleTable components.

```typescript
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

### 2. src/components/EntryForm.tsx
Form component for adding new schedule entries.

```typescript
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

### 3. src/components/ScheduleTable.tsx
Component that displays schedule entries in a table format.

```typescript
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

### 4. src/components/TableCell.tsx
Component for displaying schedule entries within a table cell.

```typescript
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

### 5. src/lib/types.ts
TypeScript type definitions.

```typescript
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

### 6. src/lib/utils.ts
Utility functions.

```typescript
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

### 7. src/lib/supabase.ts
Supabase client configuration.

```typescript
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const createClient = () => {
  return createSupabaseClient(supabaseUrl, supabaseKey);
};
```

### 8. src/app/api/schedule/route.ts
API route for fetching all entries and creating new ones.

```typescript
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

### 9. src/app/api/schedule/[id]/route.ts
API route for manipulating specific entries.

```typescript
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

## Setup Instructions

### 1. Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/leisureSG99/weeklyScheduler.git
   cd weeklyScheduler
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a new project at https://supabase.com
   - Create a table called `schedule_entries` with the schema defined above
   - Copy your project URL and anon key

4. Create a `.env.local` file in the project root with the following content:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) to see the application

### 2. Deployment to Vercel

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. Connect your GitHub repository to Vercel:
   - Sign up or log in to [Vercel](https://vercel.com)
   - Click "Import Project"
   - Select the repository
   - Add environment variables (same as in `.env.local`)
   - Deploy!

## Additional Features (Future Development)

1. **Authentication**: Add user authentication to protect the application
2. **Entry Editing**: Allow users to edit existing entries
3. **Entry Deletion**: Allow users to delete entries
4. **Filtering**: Add filters to display entries by person, context, etc.
5. **Export**: Add functionality to export schedule data
6. **Drag-and-Drop**: Allow users to drag entries between cells
7. **Mobile Responsiveness**: Improve mobile experience 