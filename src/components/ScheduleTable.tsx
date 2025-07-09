'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';
import { ScheduleEntry } from '@/lib/types';
import TableCell from './TableCell';

// Custom event name for entry added
const ENTRY_ADDED_EVENT = 'entryAdded';

interface ScheduleTableProps {
  initialData: ScheduleEntry[];
}

export default function ScheduleTable({ initialData }: ScheduleTableProps) {
  const [entries, setEntries] = useState<ScheduleEntry[]>(initialData);
  const [loading, setLoading] = useState(false);
  
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
  
  // Listen for entry added events
  useEffect(() => {
    // Event listener for when an entry is added
    const handleEntryAdded = () => {
      fetchEntries();
    };
    
    // Add event listener
    window.addEventListener(ENTRY_ADDED_EVENT, handleEntryAdded);
    
    // Clean up event listener
    return () => {
      window.removeEventListener(ENTRY_ADDED_EVENT, handleEntryAdded);
    };
  }, []);
  
  const fetchEntries = async () => {
    setLoading(true);
    try {
    const supabase = createClient();
    const { data } = await supabase.from('schedule_entries').select('*');
    if (data) setEntries(data);
    } catch (err) {
      console.error('Error fetching entries:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Get unique persons from entries
  const persons = Array.from(new Set(entries.map(entry => entry.person))).sort();
  
  // Days as column headers
  const days = ['1', '2', '3', '4', '5', 'TBD'];
  
  // Time slots
  const timeSlots = ['Reminder', 'AM', 'PM'];
  
  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Schedule Table</h2>
        <button 
          onClick={fetchEntries}
          disabled={loading}
          className={`${
            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
          } text-white font-bold py-1 px-3 rounded flex items-center`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Refreshing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Refresh
            </>
          )}
        </button>
      </div>
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
          {persons.length > 0 ? (
            persons.map((person) => (
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
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center p-4 border">
                {loading ? 'Loading entries...' : 'No entries found. Add some using the form above.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
} 