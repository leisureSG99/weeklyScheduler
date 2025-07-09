'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase';
import { ScheduleEntry } from '@/lib/types';

// Create a custom event for entry added
const ENTRY_ADDED_EVENT = 'entryAdded';

export default function EntryForm() {
  const [formData, setFormData] = useState<Partial<ScheduleEntry>>({
    title: '',
    person: '',
    context: '',
    day: '',
    type: '',
    time_slot: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    // Form validation
    if (!formData.title || !formData.person || !formData.context || 
        !formData.day || !formData.type || !formData.time_slot) {
      setError('Please fill all required fields');
      setIsSubmitting(false);
      return;
    }
    
    try {
      const supabase = createClient();
      const { error: supabaseError } = await supabase.from('schedule_entries').insert([formData]);
      
      if (supabaseError) {
        console.error('Error adding entry:', supabaseError);
        setError(supabaseError.message);
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
        
        // Show success message briefly
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        
        // Dispatch custom event that ScheduleTable can listen for
        const event = new CustomEvent(ENTRY_ADDED_EVENT);
        window.dispatchEvent(event);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-6">
      <div className="mb-2 flex justify-between items-center">
        <span className="text-purple-600">💠 Data embeds automatically - use Ctrl+S or "Save As" to save HTML with your current schedule</span>
        {success && (
          <span className="text-green-600 font-medium">✓ Entry added successfully!</span>
        )}
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 mb-4">
          <p>{error}</p>
        </div>
      )}
      
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
            disabled={isSubmitting}
            className={`${
              isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-700'
            } text-white font-bold py-2 px-4 rounded flex items-center justify-center`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </>
            ) : (
              'Add Entry'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 