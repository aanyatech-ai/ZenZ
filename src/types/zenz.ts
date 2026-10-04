export type TopicStatus = 'not_started' | 'in_progress' | 'done' | 'revise';

export interface Topic {
  id: string;
  unitId: string;
  subjectCode: string;
  title: string;
  status: TopicStatus;
  notes?: string;
  completedAt?: number;
}

export interface Unit {
  id: string;
  subjectCode: string;
  unitNumber: number;
  title: string;
  topics: Topic[];
}

export interface LabExperiment {
  id: string;
  subjectCode: string;
  expNumber: number;
  title: string;
  completed: boolean;
  dateCompleted?: string;
}

export interface MarksScheme {
  classTest?: number;      // CT max 20
  teachersAssessment?: number; // TA max 10
  endSemExam?: number;     // ESE max 70
  labSessional?: number;   // max 20
  labEse?: number;         // max 30
  generalProficiency?: number; // max 50
}

export interface Subject {
  code: string;
  name: string;
  credits: number;
  type: 'theory' | 'lab' | 'general';
  color: string;
  accentBg: string;
  minExperiments?: number;
  totalExperiments?: number;
  units: Unit[];
  experiments?: LabExperiment[];
  marks?: MarksScheme;
}

export interface StudyBlock {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "09:00"
  endTime: string;   // e.g. "10:30"
  subjectCode: string;
  topicId: string;
  title: string;
  completed: boolean;
}

export type EventCategory =
  | 'Presentation'
  | 'Exam'
  | 'Assignment submission'
  | 'Lab viva'
  | 'Birthday'
  | 'Other';

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  category: EventCategory;
  repeat: 'none' | 'yearly';
  reminder: 'on_day' | 'day_before' | 'hour_before' | 'none';
  color: string;
  notes?: string;
}

export interface NoteChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface Note {
  id: string;
  title: string;
  body: string;
  pinned: boolean;
  color: string; // pastel color hex/class
  subjectCode?: string;
  checklists: NoteChecklistItem[];
  updatedAt: number;
}

export interface SkillTask {
  id: string;
  title: string;
  type: 'soft' | 'hard';
  category: string;
  description: string;
  durationMin: number;
  frequency: 'daily' | 'weekly' | 'custom';
  done: boolean;
  lastDoneDate?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  semester: string;
  branch: string;
  examDate: string;
  dailyStudyHours: number;
  streakDays: number;
  lastStudyDate: string;
  theme: 'light' | 'dark' | 'system';
  dailyReminderTime: string; // e.g. "09:00"
  notificationsEnabled: boolean;
}

export interface PomodoroLog {
  id: string;
  date: string;
  minutes: number;
  subjectCode?: string;
  topicId?: string;
  timestamp: number;
}
