-- CREATE TABLES
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    points INTEGER DEFAULT 0,
    loyalty_level TEXT DEFAULT 'Bronze',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    location TEXT,
    capacity INTEGER,
    status TEXT DEFAULT 'Upcoming', -- Upcoming, Live, Completed
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    attendance_status TEXT DEFAULT 'Registered', -- Registered, Attended, Cancelled
    points_awarded BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS loyalty_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    points INTEGER NOT NULL,
    reason TEXT, -- 'Ticket Purchase', 'Attendance', 'Bonus'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kanban_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'Todo', -- Todo, In Progress, Review, Done
    priority TEXT DEFAULT 'Medium', -- Low, Medium, High
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FUNCTIONS FOR AUTOMATIC LOYALTY
-- Update lead level based on points
CREATE OR REPLACE FUNCTION update_loyalty_level()
RETURNS TRIGGER AS $$
BEGIN
    NEW.loyalty_level := 
        CASE 
            WHEN NEW.points >= 500 THEN 'Platinum'
            WHEN NEW.points >= 250 THEN 'Gold'
            WHEN NEW.points >= 100 THEN 'Silver'
            ELSE 'Bronze'
        END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_loyalty_level
BEFORE UPDATE OF points ON leads
FOR EACH ROW
EXECUTE FUNCTION update_loyalty_level();
