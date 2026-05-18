-- ENABLE RLS (Row Level Security)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE kanban_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- CREATE POLICIES (Since there's no AUTH, we'll allow public access for this applet demo)
-- WARNING: In a real production app with users, these would be restricted by auth.uid()
CREATE POLICY "Public Read/Write for Leads" ON leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write for Events" ON events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write for Registrations" ON registrations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write for Loyalty History" ON loyalty_history FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write for Kanban" ON kanban_tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public Read/Write for Messages" ON messages FOR ALL USING (true) WITH CHECK (true);

-- ENABLE REALTIME
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE leads;
ALTER PUBLICATION supabase_realtime ADD TABLE kanban_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE events;
