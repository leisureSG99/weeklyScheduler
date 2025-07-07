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