import { localDb } from './orbitDexie';
import type { TopicStatus } from '../types/syllabus';
import type { CadetLevel, GamificationStats, StudySession } from '../types/gamification';
import confetti from 'canvas-confetti';

export function fireOrbitConfetti() {
  try {
    confetti({
      particleCount: 65,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#00f2fe', '#4facfe', '#9d4edd', '#f59e0b', '#10b981'],
    });
  } catch (err) {
    console.warn('Confetti error:', err);
  }
}

export function calculateCadetLevel(xp: number): CadetLevel {
  if (xp >= 3000) return 'Astronaut';
  if (xp >= 1500) return 'Commander';
  if (xp >= 500) return 'Pilot';
  return 'Cadet';
}

export async function awardXP(amount: number, _reason?: string): Promise<{ newXP: number; leveledUp: boolean }> {
  const current = (await localDb.gamification.get('default_cadet')) as (GamificationStats & { uid: string }) || {
    uid: 'default_cadet',
    totalXP: 0,
    level: 'Cadet',
    currentStreak: 1,
    longestStreak: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    unlockedBadgeIds: [],
    updatedAt: Date.now(),
  };

  const oldLevel = current.level;
  const newXP = (current.totalXP || 0) + amount;
  const newLevel = calculateCadetLevel(newXP);
  const leveledUp = newLevel !== oldLevel;

  const unlockedBadgeIds = [...(current.unlockedBadgeIds || [])];
  if (!unlockedBadgeIds.includes('first_orbit')) {
    unlockedBadgeIds.push('first_orbit');
  }

  await localDb.gamification.put({
    ...current,
    totalXP: newXP,
    level: newLevel,
    unlockedBadgeIds,
    updatedAt: Date.now(),
  });

  if (amount > 0) {
    fireOrbitConfetti();
  }

  return { newXP, leveledUp };
}

export async function toggleTopicStatus(topicId: string, nextStatus: TopicStatus) {
  const topic = await localDb.topics.get(topicId);
  if (!topic) return;

  const wasDone = topic.status === 'done';
  const now = Date.now();

  await localDb.topics.update(topicId, {
    status: nextStatus,
    completedAt: nextStatus === 'done' ? now : undefined,
    actualMinutesSpent: nextStatus === 'done' && topic.actualMinutesSpent === 0 ? topic.estimatedMinutes : topic.actualMinutesSpent,
    updatedAt: now,
  });

  if (nextStatus === 'done' && !wasDone) {
    // Award 25 XP for topic completion
    await awardXP(25, `Completed topic: ${topic.title}`);
  }
}

export async function toggleSkillTask(taskId: string) {
  const task = await localDb.skillTasks.get(taskId);
  if (!task) return;

  const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
  const now = Date.now();

  await localDb.skillTasks.update(taskId, {
    status: nextStatus,
    completedAt: nextStatus === 'completed' ? now : undefined,
    updatedAt: now,
  });

  if (nextStatus === 'completed') {
    await awardXP(20, `Completed task: ${task.title}`);
  }
}

export async function completeSoftTask(taskId: string) {
  const task = await localDb.softTasks.get(taskId);
  if (!task) return;

  const now = Date.now();
  await localDb.softTasks.update(taskId, {
    status: 'completed',
    completedAt: now,
  });

  await awardXP(15, `Completed soft skill: ${task.title}`);
}

export async function recordStudySession(session: Omit<StudySession, 'id'>) {
  const id = `session_${Date.now()}`;
  const fullSession: StudySession = {
    ...session,
    id,
  };

  await localDb.studySessions.add(fullSession);
  await awardXP(session.xpEarned, `Focus Session: ${session.title}`);

  // Check if session qualifies for hyper_focus badge
  if (session.durationMinutes >= 45) {
    const stats = (await localDb.gamification.get('default_cadet')) as (GamificationStats & { uid: string }) | undefined;
    if (stats && !stats.unlockedBadgeIds.includes('hyper_focus')) {
      await localDb.gamification.update('default_cadet', {
        unlockedBadgeIds: [...stats.unlockedBadgeIds, 'hyper_focus'],
      });
    }
  }

  return fullSession;
}

export async function exportDatabaseBackup(): Promise<string> {
  const profile = await localDb.profile.toArray();
  const subjects = await localDb.subjects.toArray();
  const chapters = await localDb.chapters.toArray();
  const topics = await localDb.topics.toArray();
  const skills = await localDb.skills.toArray();
  const skillTasks = await localDb.skillTasks.toArray();
  const softTasks = await localDb.softTasks.toArray();
  const studySessions = await localDb.studySessions.toArray();
  const gamification = await localDb.gamification.toArray();

  const backupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    profile,
    subjects,
    chapters,
    topics,
    skills,
    skillTasks,
    softTasks,
    studySessions,
    gamification,
  };

  return JSON.stringify(backupData, null, 2);
}

export async function importDatabaseBackup(jsonString: string): Promise<boolean> {
  try {
    const data = JSON.parse(jsonString);
    if (!data.version || !data.subjects) {
      throw new Error('Invalid Orbit backup file structure');
    }

    await localDb.transaction('rw', [
      localDb.profile,
      localDb.subjects,
      localDb.chapters,
      localDb.topics,
      localDb.skills,
      localDb.skillTasks,
      localDb.softTasks,
      localDb.studySessions,
      localDb.gamification,
    ], async () => {
      if (data.profile?.length) await localDb.profile.bulkPut(data.profile);
      if (data.subjects?.length) await localDb.subjects.bulkPut(data.subjects);
      if (data.chapters?.length) await localDb.chapters.bulkPut(data.chapters);
      if (data.topics?.length) await localDb.topics.bulkPut(data.topics);
      if (data.skills?.length) await localDb.skills.bulkPut(data.skills);
      if (data.skillTasks?.length) await localDb.skillTasks.bulkPut(data.skillTasks);
      if (data.softTasks?.length) await localDb.softTasks.bulkPut(data.softTasks);
      if (data.studySessions?.length) await localDb.studySessions.bulkPut(data.studySessions);
      if (data.gamification?.length) await localDb.gamification.bulkPut(data.gamification);
    });

    return true;
  } catch (err) {
    console.error('Import failed:', err);
    throw err;
  }
}
