export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  avatarUrl?: string;
  examName: string;
  examDate: string; // YYYY-MM-DD
  dailyAvailableHours: number; // e.g. 3.5
  offDays: number[]; // 0=Sunday, 6=Saturday
  timeSplit: {
    syllabus: number;   // 60%
    hardSkills: number; // 25%
    softSkills: number; // 15%
  };
  examModeEnabled: boolean;
  onboardingCompleted: boolean;
  reminderTimes?: {
    morning: boolean;
    afternoon: boolean;
    evening: boolean;
    streakAlert: boolean;
  };
  createdAt: number;
  updatedAt: number;
}
