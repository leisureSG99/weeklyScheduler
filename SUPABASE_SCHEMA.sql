-- Schedule Table Manager Database Schema for Supabase

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create schedule_entries table
CREATE TABLE schedule_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  person TEXT NOT NULL,
  context TEXT NOT NULL,
  day TEXT NOT NULL,
  type TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create an index on person for faster lookups
CREATE INDEX idx_schedule_entries_person ON schedule_entries(person);

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_schedule_entries_updated_at
BEFORE UPDATE ON schedule_entries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert initial dummy data
INSERT INTO schedule_entries (title, person, context, day, type, time_slot)
VALUES 
  ('SSCPMR testing', 'Nilson', 'SSCPMR testing', '1', 'Reminder', 'Reminder'),
  ('Prepare Weekly Planning', 'Nilson', 'Team Activities', '1', 'Task', 'AM'),
  ('Elements Demo [Zoom]', 'Nilson', 'Software Demo', '2', 'Meeting', 'AM'),
  ('[LTU] Invitation to Online Briefing', 'Nilson', 'Training', '3', 'Meeting', 'AM'),
  ('IT Weekly Meeting', 'Nilson', 'Team Activities', '4', 'Meeting', 'AM'),
  ('Review - Digital and E-Signature', 'Nilson', 'Documentation', '1', 'Task', 'PM'),
  ('One App Security Enhancement briefing', 'Nilson', 'Security', '3', 'Meeting', 'PM'),
  ('Retrospection Session', 'Nilson', 'Team Activities', '4', 'Meeting', 'PM'),
  ('Team Lead Meeting', 'Nilson', 'Management', '5', 'Meeting', 'PM'),
  ('EMS Migration', 'Louis', 'EMS Migration', '1', 'Reminder', 'Reminder'),
  ('Follow up on intern's task', 'Louis', 'Management', '1', 'Task', 'AM'),
  ('Elements Demo [Zoom]', 'Louis', 'Software Demo', '2', 'Meeting', 'AM'),
  ('[LTU] Invitation to Online Briefing', 'Louis', 'Training', '3', 'Meeting', 'AM'),
  ('Work with intern on what to know for MPU', 'Louis', 'Training', '3', 'Task', 'AM'),
  ('EMS Course', 'Louis', 'Training', '1', 'Task', 'PM'),
  ('Elements Meeting Minute', 'Louis', 'Documentation', '2', 'Task', 'PM'),
  ('Monthly Report(July)', 'Louis', 'Reporting', '3', 'Task', 'PM'),
  ('Retrospection Session', 'Louis', 'Team Activities', '4', 'Meeting', 'PM'),
  ('AWS Git setup: Inform/Show Louis on the approach', 'Jaden', 'Training', '1', 'Task', 'AM'),
  ('[Official] PPO: Accreditation Updates 2025 session', 'Jaden', 'Certification', '1', 'Meeting', 'AM'),
  ('Elements Demo [Zoom]', 'Jaden', 'Software Demo', '2', 'Meeting', 'AM'),
  ('[LTU] Invitation to Online Briefing', 'Jaden', 'Training', '3', 'Meeting', 'AM'),
  ('Fix IT asset file system', 'Jaden', 'Maintenance', '1', 'Task', 'PM'),
  ('Fix IT asset repair data', 'Jaden', 'Maintenance', '2', 'Task', 'PM'),
  ('Retrospection Session', 'Jaden', 'Team Activities', '4', 'Meeting', 'PM'),
  ('IT Asset Dashboard BR Coding', 'Jaden', 'Development', 'TBD', 'Task', 'PM'); 