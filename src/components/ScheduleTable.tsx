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
            <th className="border border-gray-300 bg-gray-700 text-white p-2">Time Slot</th>
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