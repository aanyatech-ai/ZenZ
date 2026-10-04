export type RoadmapStage = 'Start' | 'Foundation' | 'Practice' | 'Project' | 'Advanced' | 'Portfolio';

export interface HardSkill {
  id: string;
  name: string;
  icon: string;
  category: 'hard';
  goal: string;
  targetLevel: 'Beginner' | 'Intermediate' | 'Master';
  currentStage: RoadmapStage;
  suggestedDailyMinutes: number;
  createdAt: number;
  updatedAt: number;
}

export interface SkillTask {
  id: string;
  skillId: string;
  title: string;
  estimatedMinutes: number;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  link?: string;
  notes?: string;
  status: 'pending' | 'completed';
  completedAt?: number;
  createdAt: number;
  updatedAt: number;
}

export interface SoftSkillTask {
  id: string;
  category: 'Communication' | 'English Speaking' | 'Public Speaking' | 'Time Management' | 'Confidence' | 'Interview Prep' | 'Teamwork';
  title: string;
  prompt: string;
  durationMinutes: number;
  date: string; // YYYY-MM-DD
  status: 'pending' | 'completed' | 'skipped';
  completedAt?: number;
}

export interface DailyChallenge {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  description: string;
  durationMinutes: number;
  category: string;
  xpReward: number;
  completed: boolean;
  completedAt?: number;
}
