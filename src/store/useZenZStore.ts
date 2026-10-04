import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  Subject,
  CalendarEvent,
  Note,
  SkillTask,
  UserProfile,
  StudyBlock,
  TopicStatus,
  MarksScheme,
  PomodoroLog,
} from '../types/zenz';
import {
  INITIAL_USER_PROFILE,
  SEMESTER_3_SUBJECTS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_NOTES,
  INITIAL_SKILLS,
} from '../seed/semester3';
import confetti from 'canvas-confetti';

export function fireZenZConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#8B5CF6', '#EC4899', '#F97316', '#06B6D4', '#10B981', '#F472B6'],
    });
  } catch (e) {
    console.warn('Confetti error:', e);
  }
}

interface ZenZState {
  user: UserProfile;
  subjects: Subject[];
  calendarEvents: CalendarEvent[];
  notes: Note[];
  skills: SkillTask[];
  studyBlocks: StudyBlock[];
  pomodoroLogs: PomodoroLog[];
  hasCompletedOnboarding: boolean;

  // Actions
  updateUserProfile: (partial: Partial<UserProfile>) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  completeOnboarding: () => void;

  // Syllabus & Topics
  toggleTopicStatus: (
    subjectCode: string,
    unitId: string,
    topicId: string,
    nextStatus?: TopicStatus
  ) => { unitCompleted: boolean; unitTitle?: string };
  updateTopicNotes: (topicId: string, notes: string) => void;
  toggleLabExperiment: (subjectCode: string, expId: string) => void;
  updateMarksScheme: (subjectCode: string, marks: Partial<MarksScheme>) => void;

  // Study Planner (Time-based)
  generateTimePlannerBlocks: (examDate?: string, dailyHours?: number) => void;
  toggleStudyBlock: (blockId: string) => void;
  rescheduleMissedBlocks: () => void;

  // Calendar
  addCalendarEvent: (event: Omit<CalendarEvent, 'id'>) => CalendarEvent;
  updateCalendarEvent: (id: string, partial: Partial<CalendarEvent>) => void;
  deleteCalendarEvent: (id: string) => void;

  // Notes
  addNote: (note: Omit<Note, 'id' | 'updatedAt'>) => Note;
  updateNote: (id: string, partial: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  toggleNotePin: (id: string) => void;
  toggleNoteChecklistItem: (noteId: string, itemId: string) => void;

  // Skills
  addSkillTask: (task: Omit<SkillTask, 'id'>) => void;
  toggleSkillTask: (id: string) => void;
  deleteSkillTask: (id: string) => void;

  // Pomodoro
  logPomodoro: (minutes: number, subjectCode?: string, topicId?: string) => void;

  // Data Management
  resetToSemester3Seed: () => void;
  exportStateToJson: () => string;
  importStateFromJson: (jsonStr: string) => boolean;
}

export const useZenZStore = create<ZenZState>()(
  persist(
    (set, get) => ({
      user: INITIAL_USER_PROFILE,
      subjects: SEMESTER_3_SUBJECTS,
      calendarEvents: INITIAL_CALENDAR_EVENTS,
      notes: INITIAL_NOTES,
      skills: INITIAL_SKILLS,
      studyBlocks: [],
      pomodoroLogs: [],
      hasCompletedOnboarding: true,

      updateUserProfile: (partial) => {
        set((state) => ({
          user: { ...state.user, ...partial },
        }));
      },

      setTheme: (theme) => {
        set((state) => ({
          user: { ...state.user, theme },
        }));

        if (typeof document !== 'undefined') {
          const root = document.documentElement;
          if (
            theme === 'dark' ||
            (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
          ) {
            root.classList.add('dark');
          } else {
            root.classList.remove('dark');
          }
        }
      },

      completeOnboarding: () => {
        set({ hasCompletedOnboarding: true });
        fireZenZConfetti();
      },

      toggleTopicStatus: (subjectCode, unitId, topicId, explicitStatus) => {
        let unitCompleted = false;
        let unitTitle = '';

        set((state) => {
          const newSubjects = state.subjects.map((sub) => {
            if (sub.code !== subjectCode) return sub;

            const newUnits = sub.units.map((unit) => {
              if (unit.id !== unitId) return unit;

              const newTopics = unit.topics.map((t) => {
                if (t.id !== topicId) return t;

                let next: TopicStatus = explicitStatus || 'not_started';
                if (!explicitStatus) {
                  const seq: TopicStatus[] = ['not_started', 'in_progress', 'done', 'revise'];
                  const idx = seq.indexOf(t.status);
                  next = seq[(idx + 1) % seq.length];
                }

                return {
                  ...t,
                  status: next,
                  completedAt: next === 'done' ? Date.now() : undefined,
                };
              });

              // Check if all topics in this unit are now done
              const allDone = newTopics.length > 0 && newTopics.every((t) => t.status === 'done');
              if (allDone) {
                unitCompleted = true;
                unitTitle = unit.title;
              }

              return { ...unit, topics: newTopics };
            });

            return { ...sub, units: newUnits };
          });

          return { subjects: newSubjects };
        });

        if (unitCompleted) {
          fireZenZConfetti();
        }

        return { unitCompleted, unitTitle };
      },

      updateTopicNotes: (topicId, notes) => {
        set((state) => ({
          subjects: state.subjects.map((sub) => ({
            ...sub,
            units: sub.units.map((unit) => ({
              ...unit,
              topics: unit.topics.map((t) => (t.id === topicId ? { ...t, notes } : t)),
            })),
          })),
        }));
      },

      toggleLabExperiment: (subjectCode, expId) => {
        set((state) => ({
          subjects: state.subjects.map((sub) => {
            if (sub.code !== subjectCode || !sub.experiments) return sub;
            return {
              ...sub,
              experiments: sub.experiments.map((exp) => {
                if (exp.id !== expId) return exp;
                const nextDone = !exp.completed;
                return {
                  ...exp,
                  completed: nextDone,
                  dateCompleted: nextDone ? new Date().toISOString().split('T')[0] : undefined,
                };
              }),
            };
          }),
        }));
      },

      updateMarksScheme: (subjectCode, marks) => {
        set((state) => ({
          subjects: state.subjects.map((sub) => {
            if (sub.code !== subjectCode) return sub;
            return {
              ...sub,
              marks: { ...sub.marks, ...marks },
            };
          }),
        }));
      },

      generateTimePlannerBlocks: (examDateInput, dailyHoursInput) => {
        const state = get();
        const examDateStr = examDateInput || state.user.examDate;
        const dailyHours = dailyHoursInput || state.user.dailyStudyHours || 4.0;

        const today = new Date();
        const examDate = new Date(examDateStr);
        const diffMs = examDate.getTime() - today.getTime();
        const daysLeft = Math.max(1, Math.min(120, Math.ceil(diffMs / (1000 * 60 * 60 * 24))));

        // Collect remaining theory topics (not done)
        const pendingTopics: Array<{ topic: any; subject: Subject }> = [];
        state.subjects.forEach((sub) => {
          if (sub.type !== 'theory') return;
          sub.units.forEach((u) => {
            u.topics.forEach((t) => {
              if (t.status !== 'done') {
                pendingTopics.push({ topic: t, subject: sub });
              }
            });
          });
        });

        // Sort by credit priority (4 credits first, then 3 credits)
        pendingTopics.sort((a, b) => b.subject.credits - a.subject.credits);

        if (pendingTopics.length === 0) {
          set({ studyBlocks: [] });
          return;
        }

        const blocks: StudyBlock[] = [];
        const timeslots = [
          { start: '09:00', end: '10:30' },
          { start: '11:00', end: '12:30' },
          { start: '15:00', end: '16:30' },
          { start: '18:00', end: '19:30' },
          { start: '20:30', end: '22:00' },
        ];

        // Determine blocks per day based on daily study hours (each block is 1.5h)
        const blocksPerDay = Math.max(1, Math.min(4, Math.round(dailyHours / 1.5)));

        let topicIndex = 0;
        for (let d = 0; d < Math.min(daysLeft, 30); d++) {
          const curDate = new Date(today);
          curDate.setDate(curDate.getDate() + d);
          const dateStr = curDate.toISOString().split('T')[0];

          for (let b = 0; b < blocksPerDay; b++) {
            if (topicIndex >= pendingTopics.length) break;

            const item = pendingTopics[topicIndex];
            const slot = timeslots[b % timeslots.length];

            blocks.push({
              id: `block_${dateStr}_${b}_${item.topic.id}`,
              date: dateStr,
              startTime: slot.start,
              endTime: slot.end,
              subjectCode: item.subject.code,
              topicId: item.topic.id,
              title: `${item.subject.code}: ${item.topic.title}`,
              completed: false,
            });

            topicIndex++;
          }
          if (topicIndex >= pendingTopics.length) break;
        }

        set({ studyBlocks: blocks });
      },

      toggleStudyBlock: (blockId) => {
        set((state) => {
          let updatedTopicId: string | null = null;
          let updatedSubjectCode: string | null = null;
          let willComplete = false;

          const newBlocks = state.studyBlocks.map((b) => {
            if (b.id !== blockId) return b;
            willComplete = !b.completed;
            updatedTopicId = b.topicId;
            updatedSubjectCode = b.subjectCode;
            return { ...b, completed: willComplete };
          });

          // If block is marked completed, mark topic as done too!
          let newSubjects = state.subjects;
          if (willComplete && updatedTopicId && updatedSubjectCode) {
            newSubjects = state.subjects.map((sub) => {
              if (sub.code !== updatedSubjectCode) return sub;
              return {
                ...sub,
                units: sub.units.map((u) => ({
                  ...u,
                  topics: u.topics.map((t) =>
                    t.id === updatedTopicId ? { ...t, status: 'done', completedAt: Date.now() } : t
                  ),
                })),
              };
            });
            fireZenZConfetti();
          }

          return { studyBlocks: newBlocks, subjects: newSubjects };
        });
      },

      rescheduleMissedBlocks: () => {
        const todayStr = new Date().toISOString().split('T')[0];
        set((state) => {
          // Missed blocks are past blocks that are not completed
          const missed = state.studyBlocks.filter(
            (b) => b.date < todayStr && !b.completed
          );
          if (missed.length === 0) return state;

          // Push them to today and upcoming days
          let offsetDays = 0;
          const rescheduled = state.studyBlocks.map((b) => {
            if (b.date < todayStr && !b.completed) {
              const newDate = new Date();
              newDate.setDate(newDate.getDate() + offsetDays);
              offsetDays = (offsetDays + 1) % 4;
              return {
                ...b,
                date: newDate.toISOString().split('T')[0],
              };
            }
            return b;
          });

          return { studyBlocks: rescheduled };
        });
      },

      // Calendar CRUD
      addCalendarEvent: (eventData) => {
        const newEvent: CalendarEvent = {
          ...eventData,
          id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        };
        set((state) => ({
          calendarEvents: [...state.calendarEvents, newEvent],
        }));
        return newEvent;
      },

      updateCalendarEvent: (id, partial) => {
        set((state) => ({
          calendarEvents: state.calendarEvents.map((evt) =>
            evt.id === id ? { ...evt, ...partial } : evt
          ),
        }));
      },

      deleteCalendarEvent: (id) => {
        set((state) => ({
          calendarEvents: state.calendarEvents.filter((evt) => evt.id !== id),
        }));
      },

      // Notes CRUD
      addNote: (noteData) => {
        const newNote: Note = {
          ...noteData,
          id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
          updatedAt: Date.now(),
        };
        set((state) => ({
          notes: [newNote, ...state.notes],
        }));
        return newNote;
      },

      updateNote: (id, partial) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, ...partial, updatedAt: Date.now() } : n
          ),
        }));
      },

      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((n) => n.id !== id),
        }));
      },

      toggleNotePin: (id) => {
        set((state) => ({
          notes: state.notes.map((n) =>
            n.id === id ? { ...n, pinned: !n.pinned, updatedAt: Date.now() } : n
          ),
        }));
      },

      toggleNoteChecklistItem: (noteId, itemId) => {
        set((state) => ({
          notes: state.notes.map((n) => {
            if (n.id !== noteId) return n;
            return {
              ...n,
              checklists: n.checklists.map((chk) =>
                chk.id === itemId ? { ...chk, done: !chk.done } : chk
              ),
              updatedAt: Date.now(),
            };
          }),
        }));
      },

      // Skills CRUD
      addSkillTask: (taskData) => {
        const newTask: SkillTask = {
          ...taskData,
          id: `skill_${Date.now()}`,
          done: false,
        };
        set((state) => ({
          skills: [...state.skills, newTask],
        }));
      },

      toggleSkillTask: (id) => {
        set((state) => ({
          skills: state.skills.map((s) => {
            if (s.id !== id) return s;
            const nextDone = !s.done;
            return {
              ...s,
              done: nextDone,
              lastDoneDate: nextDone ? new Date().toISOString().split('T')[0] : s.lastDoneDate,
            };
          }),
        }));
      },

      deleteSkillTask: (id) => {
        set((state) => ({
          skills: state.skills.filter((s) => s.id !== id),
        }));
      },

      // Pomodoro Log
      logPomodoro: (minutes, subjectCode, topicId) => {
        const log: PomodoroLog = {
          id: `pomo_${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          minutes,
          subjectCode,
          topicId,
          timestamp: Date.now(),
        };
        set((state) => ({
          pomodoroLogs: [...state.pomodoroLogs, log],
          user: {
            ...state.user,
            streakDays: Math.max(state.user.streakDays, 7),
            lastStudyDate: new Date().toISOString().split('T')[0],
          },
        }));
      },

      // Data Backup & Reset
      resetToSemester3Seed: () => {
        set({
          user: INITIAL_USER_PROFILE,
          subjects: SEMESTER_3_SUBJECTS,
          calendarEvents: INITIAL_CALENDAR_EVENTS,
          notes: INITIAL_NOTES,
          skills: INITIAL_SKILLS,
          studyBlocks: [],
        });
      },

      exportStateToJson: () => {
        const state = get();
        return JSON.stringify(
          {
            version: '2.0',
            app: 'ZenZ',
            exportedAt: new Date().toISOString(),
            user: state.user,
            subjects: state.subjects,
            calendarEvents: state.calendarEvents,
            notes: state.notes,
            skills: state.skills,
            studyBlocks: state.studyBlocks,
            pomodoroLogs: state.pomodoroLogs,
          },
          null,
          2
        );
      },

      importStateFromJson: (jsonStr) => {
        try {
          const data = JSON.parse(jsonStr);
          if (!data.subjects || !Array.isArray(data.subjects)) {
            throw new Error('Invalid ZenZ backup structure');
          }
          set({
            user: data.user || INITIAL_USER_PROFILE,
            subjects: data.subjects,
            calendarEvents: data.calendarEvents || INITIAL_CALENDAR_EVENTS,
            notes: data.notes || INITIAL_NOTES,
            skills: data.skills || INITIAL_SKILLS,
            studyBlocks: data.studyBlocks || [],
            pomodoroLogs: data.pomodoroLogs || [],
          });
          return true;
        } catch (err) {
          console.error('Failed to import ZenZ JSON:', err);
          return false;
        }
      },
    }),
    {
      name: 'zenz_study_tracker_v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
