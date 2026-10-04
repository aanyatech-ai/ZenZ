import Dexie, { type Table } from 'dexie';
import type { UserProfile } from '../types/auth';
import type { Subject, Chapter, Topic } from '../types/syllabus';
import type { HardSkill, SkillTask, SoftSkillTask } from '../types/skills';
import type { GamificationStats, StudySession } from '../types/gamification';
import type { SyncQueueItem } from '../types/sync';

export class OrbitDatabase extends Dexie {
  profile!: Table<UserProfile, string>;
  subjects!: Table<Subject, string>;
  chapters!: Table<Chapter, string>;
  topics!: Table<Topic, string>;
  skills!: Table<HardSkill, string>;
  skillTasks!: Table<SkillTask, string>;
  softTasks!: Table<SoftSkillTask, string>;
  studySessions!: Table<StudySession, string>;
  gamification!: Table<GamificationStats, string>;
  syncQueue!: Table<SyncQueueItem, string>;

  constructor() {
    super('OrbitLocalDB');
    this.version(1).stores({
      profile: 'uid',
      subjects: 'id, name, priority',
      chapters: 'id, subjectId, order',
      topics: 'id, subjectId, chapterId, status, difficulty, estimatedMinutes',
      skills: 'id, category, currentStage',
      skillTasks: 'id, skillId, status, priority',
      softTasks: 'id, category, date, status',
      studySessions: 'id, type, dateStr, startedAt',
      gamification: 'uid',
      syncQueue: 'id, collection, timestamp'
    });
  }
}

export const localDb = new OrbitDatabase();
