export type TopicStatus = 'not_started' | 'in_progress' | 'done' | 'revise';
export type TopicDifficulty = 'easy' | 'medium' | 'hard';

export interface Subject {
  id: string;
  name: string;
  color: string; // Tailwind color or hex
  icon: string;
  priority: number;
  targetCompletionDate?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Chapter {
  id: string;
  subjectId: string;
  title: string;
  order: number;
  createdAt: number;
  updatedAt: number;
}

export interface Topic {
  id: string;
  subjectId: string;
  chapterId: string;
  title: string;
  status: TopicStatus;
  difficulty: TopicDifficulty;
  estimatedMinutes: number;
  actualMinutesSpent: number;
  notes?: string;
  completedAt?: number;
  revisionDueDates?: number[];
  createdAt: number;
  updatedAt: number;
}
