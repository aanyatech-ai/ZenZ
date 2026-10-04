import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useZenZStore } from '../store/useZenZStore';
import { ZenZCard } from '../components/common/ZenZCard';
import { ZenZPillButton } from '../components/common/ZenZPillButton';
import { ZenZProgressRing } from '../components/common/ZenZProgressRing';
import { ZenZMascot } from '../components/common/ZenZMascot';
import { ZenZPomodoroModal } from '../components/common/ZenZPomodoroModal';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Flame,
  Timer,
  CheckSquare,
  FileText,
  Calendar,
  Clock,
  ChevronRight,
} from 'lucide-react';

export const Home: React.FC = () => {
  const { user, subjects, calendarEvents, studyBlocks, toggleStudyBlock } = useZenZStore();
  const navigate = useNavigate();

  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? `Good morning, ${user.name} 🌸`
      : hour < 17
      ? `Good afternoon, ${user.name} ☀️`
      : `Good evening, ${user.name} ✨`;

  // Compute total syllabus progress
  let totalTopics = 0;
  let doneTopics = 0;
  subjects.forEach((sub) => {
    if (sub.type !== 'theory') return;
    sub.units.forEach((u) => {
      u.topics.forEach((t) => {
        totalTopics++;
        if (t.status === 'done') doneTopics++;
      });
    });
  });
  const overallProgress = totalTopics > 0 ? Math.round((doneTopics / totalTopics) * 100) : 0;

  // Today's study blocks
  const todayStr = new Date().toISOString().split('T')[0];
  const todayBlocks = studyBlocks.filter((b) => b.date === todayStr);
  const doneTodayBlocks = todayBlocks.filter((b) => b.completed).length;

  // Next 3 upcoming events
  const upcomingEvents = calendarEvents
    .filter((e) => e.date >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  const getDaysUntil = (dateStr: string) => {
    const today = new Date(todayStr);
    const target = new Date(dateStr);
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 0) return 'Today! 🎯';
    if (diff === 1) return 'Tomorrow';
    return `in ${diff} days`;
  };

  return (
    <div className="space-y-6 pb-24 max-w-md md:max-w-4xl mx-auto px-4 pt-4">
      {/* Greeting Header & Mascot Banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-3"
      >
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-pink-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> B.Tech CSE (AI) • Sem III
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-sans mt-0.5">
            {greeting}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-purple-300/70 mt-1">
            Let's maintain your {user.streakDays}-day study streak today! 🌸
          </p>
        </div>

        <ZenZMascot size="sm" showBubble={false} />
      </motion.div>

      {/* Today's Focus Card with Animated Progress Ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.08 }}
      >
        <ZenZCard
          variant="gradient"
          className="relative overflow-hidden p-6 border-pink-300/40 shadow-xl"
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/70 dark:bg-[#1E1632]/80 text-[11px] font-bold text-purple-700 dark:text-purple-300 shadow-sm border border-purple-200/50">
                <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500" />
                <span>Today's Study Horizon</span>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Syllabus Mastery
              </h3>
              <p className="text-xs text-slate-600 dark:text-purple-200/80 max-w-xs">
                {doneTopics} of {totalTopics} topics completed. You're doing wonderful! Keep going.
              </p>

              <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                <ZenZPillButton
                  size="sm"
                  onClick={() => setIsPomodoroOpen(true)}
                  icon={<Timer className="w-3.5 h-3.5" />}
                >
                  Start Focus Block
                </ZenZPillButton>

                <button
                  onClick={() => navigate('/planner')}
                  className="px-4 py-2 rounded-full text-xs font-bold text-purple-700 dark:text-purple-300 bg-white/60 dark:bg-purple-950/40 border border-purple-200/70 hover:bg-white transition-colors"
                >
                  View Planner →
                </button>
              </div>
            </div>

            {/* Progress Ring */}
            <div className="shrink-0 flex flex-col items-center">
              <ZenZProgressRing
                progress={overallProgress}
                size={120}
                strokeWidth={10}
                label="Syllabus"
                sublabel={`${doneTopics}/${totalTopics} topics`}
              />
            </div>
          </div>
        </ZenZCard>
      </motion.div>

      {/* Quick Actions (Pomodoro, To-Do, Notes, Calendar) */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-purple-300/70 mb-2.5 px-1">
          Quick Actions
        </h4>
        <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => setIsPomodoroOpen(true)}
            className="p-3.5 rounded-3xl bg-white/80 dark:bg-[#1C162E]/80 border border-purple-200/60 dark:border-purple-500/25 flex flex-col items-center gap-1.5 shadow-sm hover:border-pink-300 transition-all select-none"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md">
              <Timer className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
              Pomodoro
            </span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => navigate('/planner')}
            className="p-3.5 rounded-3xl bg-white/80 dark:bg-[#1C162E]/80 border border-purple-200/60 dark:border-purple-500/25 flex flex-col items-center gap-1.5 shadow-sm hover:border-pink-300 transition-all select-none"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-500 to-orange-400 flex items-center justify-center text-white shadow-md">
              <CheckSquare className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
              To-Do
            </span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => navigate('/notes')}
            className="p-3.5 rounded-3xl bg-white/80 dark:bg-[#1C162E]/80 border border-purple-200/60 dark:border-purple-500/25 flex flex-col items-center gap-1.5 shadow-sm hover:border-pink-300 transition-all select-none"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-orange-400 to-amber-500 flex items-center justify-center text-white shadow-md">
              <FileText className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
              Notes
            </span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.94 }}
            onClick={() => navigate('/calendar')}
            className="p-3.5 rounded-3xl bg-white/80 dark:bg-[#1C162E]/80 border border-purple-200/60 dark:border-purple-500/25 flex flex-col items-center gap-1.5 shadow-sm hover:border-pink-300 transition-all select-none"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-teal-400 to-emerald-500 flex items-center justify-center text-white shadow-md">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
              Calendar
            </span>
          </motion.button>
        </div>
      </div>

      {/* Today's Scheduled Time Blocks (if any generated) */}
      {todayBlocks.length > 0 && (
        <ZenZCard variant="glass" className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-pink-500" /> Today's Focus Blocks ({doneTodayBlocks}/{todayBlocks.length})
            </h4>
            <button
              onClick={() => navigate('/planner')}
              className="text-xs text-pink-500 hover:underline font-semibold"
            >
              Planner →
            </button>
          </div>

          <div className="space-y-2">
            {todayBlocks.slice(0, 3).map((block) => (
              <div
                key={block.id}
                onClick={() => toggleStudyBlock(block.id)}
                className={`p-3 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                  block.completed
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300/40 text-slate-400 line-through'
                    : 'bg-white/60 dark:bg-[#1E1632]/60 border-purple-200/60 text-slate-800 dark:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={block.completed}
                    onChange={() => {}}
                    className="w-4 h-4 accent-pink-500 rounded cursor-pointer"
                  />
                  <div>
                    <div className="text-xs font-bold">{block.title}</div>
                    <div className="text-[10px] text-slate-400">
                      {block.startTime} - {block.endTime}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                  {block.subjectCode}
                </span>
              </div>
            ))}
          </div>
        </ZenZCard>
      )}

      {/* Semester III Subjects Grid with % Progress */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-purple-300/70">
            Semester III Subjects Progress
          </h4>
          <button
            onClick={() => navigate('/syllabus')}
            className="text-xs font-bold text-pink-500 hover:text-pink-600 flex items-center gap-0.5"
          >
            All Subjects <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {subjects
            .filter((s) => s.type === 'theory')
            .map((sub) => {
              let subTotal = 0;
              let subDone = 0;
              sub.units.forEach((u) => {
                u.topics.forEach((t) => {
                  subTotal++;
                  if (t.status === 'done') subDone++;
                });
              });
              const pct = subTotal > 0 ? Math.round((subDone / subTotal) * 100) : 0;

              return (
                <ZenZCard
                  key={sub.code}
                  interactive
                  onClick={() => navigate('/syllabus')}
                  className="p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span
                        className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md"
                        style={{ backgroundColor: `${sub.color}25`, color: sub.color }}
                      >
                        {sub.code} • {sub.credits} Cr
                      </span>
                      <h5 className="text-sm font-bold text-slate-900 dark:text-white mt-1.5 line-clamp-1">
                        {sub.name}
                      </h5>
                      <span className="text-[11px] text-slate-400">
                        {subDone}/{subTotal} topics covered
                      </span>
                    </div>

                    <span className="text-sm font-black text-slate-800 dark:text-white font-sans">
                      {pct}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full bg-purple-100 dark:bg-purple-950/60 overflow-hidden mt-3">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: sub.color }}
                    />
                  </div>
                </ZenZCard>
              );
            })}
        </div>
      </div>

      {/* Next 3 Upcoming Important Dates */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-purple-300/70">
            Upcoming Important Dates 🗓️
          </h4>
          <button
            onClick={() => navigate('/calendar')}
            className="text-xs font-bold text-pink-500 hover:text-pink-600 flex items-center gap-0.5"
          >
            View Calendar <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <ZenZCard variant="glass" className="p-4 divide-y divide-purple-100 dark:divide-purple-500/15">
          {upcomingEvents.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">
              No upcoming events. Tap calendar to add one! 🌸
            </p>
          ) : (
            upcomingEvents.map((evt) => (
              <div
                key={evt.id}
                onClick={() => navigate('/calendar')}
                className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: evt.color }}
                  />
                  <div>
                    <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-pink-500 transition-colors">
                      {evt.title}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{evt.category}</span>
                      <span>•</span>
                      <span>{evt.date}</span>
                      {evt.time && <span>({evt.time})</span>}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    getDaysUntil(evt.date).includes('Today')
                      ? 'bg-rose-500/15 text-rose-500 animate-pulse'
                      : 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300'
                  }`}
                >
                  {getDaysUntil(evt.date)}
                </span>
              </div>
            ))
          )}
        </ZenZCard>
      </div>

      {/* Pomodoro Modal */}
      <ZenZPomodoroModal
        isOpen={isPomodoroOpen}
        onClose={() => setIsPomodoroOpen(false)}
      />
    </div>
  );
};
