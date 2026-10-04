export interface PlannedItem {
  id: string;
  type: 'syllabus' | 'hard_skill' | 'soft_skill';
  referenceId: string;
  title: string;
  subtitle: string;
  scheduledTime: string; // e.g. "09:00"
  estimatedMinutes: number;
  priorityScore: number;
  status: 'pending' | 'in_progress' | 'completed' | 'snoozed' | 'skipped';
  reason?: string; // Transparent priority rationale
}

export interface DaySchedule {
  date: string; // YYYY-MM-DD
  items: PlannedItem[];
  totalPlannedMinutes: number;
  availableMinutes: number;
  hasTimeGap: boolean;
  timeGapMinutes?: number;
}
