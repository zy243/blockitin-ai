// In-memory database for Blockitin AI

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Credential {
  id: string;
  userId: string;
  title: string;
  institution: string;
  date: string;
  type: 'degree' | 'certification' | 'certificate';
  status: 'verified' | 'pending' | 'minting';
  views: number;
  nftAddress?: string;
  ipfsHash?: string;
  transactionHash?: string;
}

export interface HealthRecord {
  id: string;
  userId: string;
  type: string;
  title: string;
  date: string;
  provider: string;
  status: 'verified' | 'pending' | 'uploaded';
  shared: boolean;
  encrypted?: boolean;
  ipfsHash?: string;
}

export interface Publication {
  id: string;
  userId: string;
  title: string;
  authors: string[];
  journal: string;
  status: 'published' | 'under_review' | 'draft' | 'submitted';
  date: string;
  citations: number;
  doi?: string;
}

export interface Assignment {
  id: string;
  userId: string;
  title: string;
  course: string;
  dueDate: string;
  status: 'in_progress' | 'not_started' | 'completed' | 'created';
  priority: 'high' | 'medium' | 'low';
  progress: number;
  estimatedHours: number;
  spentHours: number;
}

export interface WellnessCheckin {
  id: string;
  userId: string;
  date: string;
  mood: number;
  energy: number;
  stress: number;
  sleep: number;
  notes?: string;
}

export interface AttendanceRecord {
    id: string;
    userId: string;
    course: string;
    date: string;
    time: string;
    status: 'present' | 'absent';
}

const db = {
  users: new Map<string, User>(),
  credentials: new Map<string, Credential>(),
  healthRecords: new Map<string, HealthRecord>(),
  publications: new Map<string, Publication>(),
  assignments: new Map<string, Assignment>(),
  wellnessCheckins: new Map<string, WellnessCheckin>(),
  attendance: new Map<string, AttendanceRecord>()
};

// Seed data
const defaultUserId = 'default_user';
db.users.set(defaultUserId, { id: defaultUserId, name: 'Sarah Johnson', email: 'sarah.johnson@email.com' });

db.credentials.set('cred-1', {
    id: 'cred-1',
    userId: defaultUserId,
    title: 'Bachelor of Computer Science',
    institution: 'MIT',
    date: '2024-05-15',
    type: 'degree',
    status: 'verified',
    views: 1247,
    nftAddress: '0x1234...5678',
    ipfsHash: 'QmX1Y2Z3...'
});

db.healthRecords.set('health-1', {
    id: 'health-1',
    userId: defaultUserId,
    type: 'vaccination',
    title: 'COVID-19 Vaccination',
    date: '2024-01-15',
    provider: 'Campus Health Center',
    status: 'verified',
    shared: false
});

db.publications.set('pub-1', {
    id: 'pub-1',
    userId: defaultUserId,
    title: 'Deep Learning Approaches for Student Performance Prediction',
    authors: ['Sarah Johnson', 'Dr. Michael Chen'],
    journal: 'Journal of Educational Technology',
    status: 'published',
    date: '2024-01-15',
    citations: 23,
    doi: '10.1000/182'
});

db.assignments.set('assign-1', {
    id: 'assign-1',
    userId: defaultUserId,
    title: 'Machine Learning Final Project',
    course: 'CS 6.867',
    dueDate: '2024-01-20',
    status: 'in_progress',
    priority: 'high',
    progress: 75,
    estimatedHours: 20,
    spentHours: 15
});

db.wellnessCheckins.set('checkin-1', {
    id: 'checkin-1',
    userId: defaultUserId,
    date: new Date().toISOString(),
    mood: 4,
    energy: 5,
    stress: 2,
    sleep: 8
});

db.attendance.set('att-1', {
    id: 'att-1',
    userId: defaultUserId,
    course: 'Advanced Machine Learning',
    date: '2024-01-15',
    time: '10:00 AM',
    status: 'present'
});

export const mockDatabase = db;
