export type CadetLevel = 'Cadet' | 'Pilot' | 'Commander' | 'Astronaut';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'milestone' | 'streak' | 'focus' | 'mastery';
  unlockedAt?: number;
}

export interface GamificationStats {
  totalXP: number;
  level: CadetLevel;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string; // YYYY-MM-DD
  unlockedBadgeIds: string[];
  updatedAt: number;
}

export interface StudySession {
  id: string;
  type: 'topic' | 'hard_skill' | 'soft_skill' | 'freestyle';
  referenceId?: string; // topicId or skillTaskId
  title: string;
  durationMinutes: number;
  startedAt: number;
  endedAt: number;
  xpEarned: number;
  wasCompleted: boolean;
  dateStr: string; // YYYY-MM-DD
}
