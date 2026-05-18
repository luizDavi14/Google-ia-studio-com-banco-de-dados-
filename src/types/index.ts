export interface Lead {
    id: string;
    name: string;
    email: string;
    phone?: string;
    points: number;
    loyalty_level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
    created_at: string;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    event_date: string;
    location: string;
    capacity: number;
    status: 'Upcoming' | 'Live' | 'Completed';
    created_at: string;
}

export interface Registration {
    id: string;
    lead_id: string;
    event_id: string;
    attendance_status: 'Registered' | 'Attended' | 'Cancelled';
    points_awarded: boolean;
    created_at: string;
}

export interface LoyaltyHistory {
    id: string;
    lead_id: string;
    points: number;
    reason: string;
    created_at: string;
}

export interface KanbanTask {
    id: string;
    title: string;
    description: string;
    status: 'Todo' | 'In Progress' | 'Review' | 'Done';
    priority: 'Low' | 'Medium' | 'High';
    created_at: string;
}

export interface Message {
    id: string;
    sender_name: string;
    content: string;
    created_at: string;
}

export type OperationType = 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  }
}
