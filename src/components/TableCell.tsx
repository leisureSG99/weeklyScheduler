'use client';

import { useState } from 'react';
import { ScheduleEntry } from '@/lib/types';
import { getBackgroundColorByType } from '@/lib/utils';
import { createClient } from '@/lib/supabase';

// Custom event name for entry changes
const ENTRY_CHANGED_EVENT = 'entryAdded';

interface TableCellProps {
  entries: ScheduleEntry[];
}

export default function TableCell({ entries }: TableCellProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setIsDeleting(id);
      try {
        const supabase = createClient();
        const { error } = await supabase
          .from('schedule_entries')
          .delete()
          .eq('id', id);
          
        if (error) {
          console.error('Error deleting entry:', error);
          alert('Failed to delete entry');
        } else {
          // Dispatch custom event that ScheduleTable can listen for
          const event = new CustomEvent(ENTRY_CHANGED_EVENT);
          window.dispatchEvent(event);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setIsDeleting(null);
      }
    }
  };

  return (
    <td className="border border-gray-300 p-2 min-w-[200px] align-top">
      {entries.length > 0 ? (
        <div className="flex flex-col gap-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`p-2 rounded ${getBackgroundColorByType(entry.type)} relative group`}
              title={`${entry.title} - ${entry.context} (${entry.type})`}
            >
              <div className="font-semibold">{entry.title}</div>
              <div className="text-sm opacity-90">{entry.context}</div>
              <span className="absolute top-0 right-1 text-xs font-bold">{entry.type.charAt(0)}</span>
              
              {/* Delete button */}
              <button
                onClick={() => handleDelete(entry.id)}
                disabled={isDeleting === entry.id}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Delete entry"
              >
                {isDeleting === entry.id ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  <span>&times;</span>
                )}
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </td>
  );
} 