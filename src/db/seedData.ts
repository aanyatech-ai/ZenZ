import { localDb } from './orbitDexie';
import type { UserProfile } from '../types/auth';
import type { Subject, Chapter, Topic } from '../types/syllabus';
import type { HardSkill, SkillTask, SoftSkillTask } from '../types/skills';
import type { GamificationStats, StudySession, Badge } from '../types/gamification';

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'first_orbit',
    name: 'First Orbit',
    description: 'Completed your first study topic in Orbit.',
    icon: '🚀',
    category: 'milestone',
  },
  {
    id: 'streak_7',
    name: 'Cosmic Fire',
    description: 'Maintained a 7-day continuous study streak.',
    icon: '🔥',
    category: 'streak',
  },
  {
    id: 'hyper_focus',
    name: 'Deep Space Focus',
    description: 'Completed a 45+ minute uninterrupted focus session.',
    icon: '⚡',
    category: 'focus',
  },
  {
    id: 'polymath',
    name: 'Polymath Cadet',
    description: 'Studied both academic syllabus and hard skill on the same day.',
    icon: '🧠',
    category: 'mastery',
  },
  {
    id: 'vocal_voyager',
    name: 'Vocal Voyager',
    description: 'Completed 3 daily speaking micro-missions.',
    icon: '🎙️',
    category: 'mastery',
  },
  {
    id: 'syllabus_titan',
    name: 'Syllabus Titan',
    description: 'Completed all topics in a major chapter.',
    icon: '🏆',
    category: 'milestone',
  },
];

export async function isDatabaseEmpty(): Promise<boolean> {
  const profileCount = await localDb.profile.count();
  const subjectCount = await localDb.subjects.count();
  return profileCount === 0 && subjectCount === 0;
}

export async function seedDemoData(force = false) {
  if (!force && !(await isDatabaseEmpty())) {
    return;
  }

  // Clear existing if force
  if (force) {
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
      await localDb.profile.clear();
      await localDb.subjects.clear();
      await localDb.chapters.clear();
      await localDb.topics.clear();
      await localDb.skills.clear();
      await localDb.skillTasks.clear();
      await localDb.softTasks.clear();
      await localDb.studySessions.clear();
      await localDb.gamification.clear();
    });
  }

  const now = Date.now();
  const targetExamDate = new Date();
  targetExamDate.setDate(targetExamDate.getDate() + 42);
  const examDateStr = targetExamDate.toISOString().split('T')[0];

  // 1. Profile
  const profile: UserProfile = {
    uid: 'default_cadet',
    name: 'Cadet Aryan',
    email: 'aryan@orbit.space',
    avatarUrl: '',
    examName: 'GATE Computer Science 2026',
    examDate: examDateStr,
    dailyAvailableHours: 4.0,
    offDays: [0], // Sunday
    timeSplit: {
      syllabus: 60,
      hardSkills: 25,
      softSkills: 15,
    },
    examModeEnabled: false,
    onboardingCompleted: true,
    reminderTimes: {
      morning: true,
      afternoon: false,
      evening: true,
      streakAlert: true,
    },
    createdAt: now - 86400000 * 14,
    updatedAt: now,
  };

  // 2. Subjects
  const subjects: Subject[] = [
    {
      id: 'sub_cn',
      name: 'Computer Networks',
      color: '#00f2fe',
      icon: 'Network',
      priority: 1,
      targetCompletionDate: examDateStr,
      createdAt: now - 86400000 * 10,
      updatedAt: now,
    },
    {
      id: 'sub_dsa',
      name: 'Algorithms & Data Structures',
      color: '#9d4edd',
      icon: 'Binary',
      priority: 1,
      targetCompletionDate: examDateStr,
      createdAt: now - 86400000 * 10,
      updatedAt: now,
    },
    {
      id: 'sub_os',
      name: 'Operating Systems',
      color: '#f59e0b',
      icon: 'Terminal',
      priority: 2,
      targetCompletionDate: examDateStr,
      createdAt: now - 86400000 * 8,
      updatedAt: now,
    },
    {
      id: 'sub_dbms',
      name: 'Database Management Systems',
      color: '#10b981',
      icon: 'Database',
      priority: 2,
      targetCompletionDate: examDateStr,
      createdAt: now - 86400000 * 6,
      updatedAt: now,
    },
  ];

  // 3. Chapters
  const chapters: Chapter[] = [
    {
      id: 'ch_cn_1',
      subjectId: 'sub_cn',
      title: 'Transport Layer Protocols',
      order: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'ch_cn_2',
      subjectId: 'sub_cn',
      title: 'Network Routing & IPv6',
      order: 2,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'ch_dsa_1',
      subjectId: 'sub_dsa',
      title: 'Graph Algorithms & DP',
      order: 1,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'ch_os_1',
      subjectId: 'sub_os',
      title: 'Process Synchronization & Deadlocks',
      order: 1,
      createdAt: now,
      updatedAt: now,
    },
  ];

  // 4. Topics
  const topics: Topic[] = [
    {
      id: 'top_cn_1',
      subjectId: 'sub_cn',
      chapterId: 'ch_cn_1',
      title: 'TCP 3-Way Handshake & Congestion Control',
      status: 'in_progress',
      difficulty: 'hard',
      estimatedMinutes: 45,
      actualMinutesSpent: 20,
      notes: 'Review Reno vs Tahoe algorithms and slow start threshold mechanics.',
      createdAt: now - 86400000,
      updatedAt: now,
    },
    {
      id: 'top_cn_2',
      subjectId: 'sub_cn',
      chapterId: 'ch_cn_1',
      title: 'UDP Header Structure & Flow Control Comparison',
      status: 'done',
      difficulty: 'easy',
      estimatedMinutes: 30,
      actualMinutesSpent: 28,
      completedAt: now - 86400000 * 2,
      notes: 'UDP is lightweight, 8-byte header, connectionless.',
      createdAt: now - 86400000 * 3,
      updatedAt: now - 86400000 * 2,
    },
    {
      id: 'top_cn_3',
      subjectId: 'sub_cn',
      chapterId: 'ch_cn_1',
      title: 'Selective Repeat & Go-Back-N Sliding Window',
      status: 'revise',
      difficulty: 'medium',
      estimatedMinutes: 45,
      actualMinutesSpent: 45,
      notes: 'Calculate window size efficiency and sender/receiver buffer constraints.',
      createdAt: now - 86400000 * 2,
      updatedAt: now - 86400000,
    },
    {
      id: 'top_cn_4',
      subjectId: 'sub_cn',
      chapterId: 'ch_cn_2',
      title: 'CIDR Subnetting and VLSM Calculations',
      status: 'not_started',
      difficulty: 'medium',
      estimatedMinutes: 40,
      actualMinutesSpent: 0,
      notes: 'Practice prefix masking and host range allocation.',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'top_dsa_1',
      subjectId: 'sub_dsa',
      chapterId: 'ch_dsa_1',
      title: "Dijkstra's & Bellman-Ford Shortest Path",
      status: 'done',
      difficulty: 'hard',
      estimatedMinutes: 60,
      actualMinutesSpent: 65,
      completedAt: now - 86400000,
      notes: 'Min-heap priority queue implementation for Dijkstra: O((V+E)log V).',
      createdAt: now - 86400000 * 4,
      updatedAt: now - 86400000,
    },
    {
      id: 'top_dsa_2',
      subjectId: 'sub_dsa',
      chapterId: 'ch_dsa_1',
      title: 'Topological Sort & Cycle Detection in DAGs',
      status: 'not_started',
      difficulty: 'medium',
      estimatedMinutes: 40,
      actualMinutesSpent: 0,
      notes: "Kahn's algorithm using in-degree array vs DFS post-order stack.",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'top_os_1',
      subjectId: 'sub_os',
      chapterId: 'ch_os_1',
      title: "Banker's Algorithm for Deadlock Avoidance",
      status: 'not_started',
      difficulty: 'hard',
      estimatedMinutes: 50,
      actualMinutesSpent: 0,
      notes: 'Safety state verification with Need = Max - Allocation matrix.',
      createdAt: now,
      updatedAt: now,
    },
  ];

  // 5. Hard Skills
  const skills: HardSkill[] = [
    {
      id: 'skill_fullstack',
      name: 'Full-Stack Web Engineering',
      icon: 'Code2',
      category: 'hard',
      goal: 'Master React, Node.js & System Architecture for high-scale apps',
      targetLevel: 'Master',
      currentStage: 'Practice',
      suggestedDailyMinutes: 45,
      createdAt: now - 86400000 * 12,
      updatedAt: now,
    },
    {
      id: 'skill_python_dsa',
      name: 'Python & Algorithms Roadmap',
      icon: 'Cpu',
      category: 'hard',
      goal: 'Solve 150+ LeetCode problems and understand time complexity proofs',
      targetLevel: 'Intermediate',
      currentStage: 'Project',
      suggestedDailyMinutes: 30,
      createdAt: now - 86400000 * 10,
      updatedAt: now,
    },
  ];

  // 6. Skill Tasks
  const skillTasks: SkillTask[] = [
    {
      id: 'st_1',
      skillId: 'skill_fullstack',
      title: 'Build and deploy real-time WebSocket messaging service',
      estimatedMinutes: 45,
      priority: 'high',
      status: 'pending',
      notes: 'Focus on heartbeat ping-pong and reconnection backoff.',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'st_2',
      skillId: 'skill_fullstack',
      title: 'Optimize React bundle size with dynamic code splitting & lazy load',
      estimatedMinutes: 30,
      priority: 'medium',
      status: 'completed',
      completedAt: now - 86400000,
      createdAt: now - 86400000 * 2,
      updatedAt: now - 86400000,
    },
    {
      id: 'st_3',
      skillId: 'skill_python_dsa',
      title: 'Implement LRU Cache using Doubly Linked List + Hash Map',
      estimatedMinutes: 35,
      priority: 'high',
      status: 'pending',
      notes: 'O(1) get and put time complexity.',
      createdAt: now,
      updatedAt: now,
    },
  ];

  // 7. Soft Skill Tasks
  const todayStr = new Date().toISOString().split('T')[0];
  const softTasks: SoftSkillTask[] = [
    {
      id: 'soft_1',
      category: 'English Speaking',
      title: 'Daily 2-Minute Vocal Reflection',
      prompt: 'Explain the concept of "Database Indexing & B-Trees" out loud as if explaining to a 10-year-old. Speak clearly without filler words for 2 minutes.',
      durationMinutes: 15,
      date: todayStr,
      status: 'pending',
    },
    {
      id: 'soft_2',
      category: 'Interview Prep',
      title: 'STAR Method Storytelling Practice',
      prompt: 'Describe a challenging bug you diagnosed and solved under high pressure using Situation, Task, Action, Result framework.',
      durationMinutes: 20,
      date: todayStr,
      status: 'completed',
      completedAt: now - 86400000,
    },
  ];

  // 8. Study Sessions for Heatmap (past 14 days)
  const studySessions: StudySession[] = [];
  for (let i = 14; i >= 0; i--) {
    const sessionDate = new Date();
    sessionDate.setDate(sessionDate.getDate() - i);
    const dateStr = sessionDate.toISOString().split('T')[0];
    
    // Skip a day or two to make the heatmap realistic
    if (i === 4 || i === 9) continue;

    const count = i % 3 === 0 ? 2 : 1;
    for (let j = 0; j < count; j++) {
      const duration = 25 + (j * 15) + (i % 2 === 0 ? 20 : 0);
      studySessions.push({
        id: `sess_${i}_${j}`,
        type: j % 2 === 0 ? 'topic' : 'hard_skill',
        title: j % 2 === 0 ? 'Computer Networks Focus' : 'Python DSA Coding',
        durationMinutes: duration,
        startedAt: sessionDate.getTime() - duration * 60000,
        endedAt: sessionDate.getTime(),
        xpEarned: Math.round(duration * 0.75),
        wasCompleted: true,
        dateStr,
      });
    }
  }

  // 9. Gamification Stats
  const gamification: GamificationStats = {
    totalXP: 420,
    level: 'Cadet',
    currentStreak: 7,
    longestStreak: 12,
    lastActiveDate: todayStr,
    unlockedBadgeIds: ['first_orbit', 'streak_7', 'hyper_focus'],
    updatedAt: now,
  };

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
    await localDb.profile.put(profile);
    await localDb.subjects.bulkPut(subjects);
    await localDb.chapters.bulkPut(chapters);
    await localDb.topics.bulkPut(topics);
    await localDb.skills.bulkPut(skills);
    await localDb.skillTasks.bulkPut(skillTasks);
    await localDb.softTasks.bulkPut(softTasks);
    await localDb.studySessions.bulkPut(studySessions);
    await localDb.gamification.put({ ...gamification, uid: 'default_cadet' } as GamificationStats & { uid: string });
  });
}
