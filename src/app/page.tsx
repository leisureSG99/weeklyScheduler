import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { createClient } from '@/lib/supabase';

// Import server components directly
import EntryForm from '@/components/EntryForm';

// Use dynamic import with ssr: false for client components that use refs
const ScheduleTable = dynamic(() => import('@/components/ScheduleTable'), {
  ssr: true,
});

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
      <Suspense fallback={<div>Loading schedule table...</div>}>
        <ScheduleTable initialData={scheduleEntries || []} />
      </Suspense>
    </main>
  );
} 