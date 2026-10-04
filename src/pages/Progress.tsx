import React, { useState } from 'react';
import { Card } from '../components/common/Card';
import { Flame, Trophy, Award, BarChart2, Calendar, Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { localDb } from '../db/orbitDexie';
import { INITIAL_BADGES } from '../db/seedData';
import type { GamificationStats } from '../types/gamification';

export const Progress: React.FC = () => {
  const stats = useLiveQuery(
    () => localDb.gamification.get('default_cadet') as Promise<(GamificationStats & { uid: string }) | undefined>,
    []
  );
  const studySessions = useLiveQuery(() => localDb.studySessions.toArray(), []) || [];
  const topics = useLiveQuery(() => localDb.topics.toArray(), []) || [];

  const [hoveredDay, setHoveredDay] = useState<{
    dateStr: string;
    minutes: number;
    sessions: number;
  } | null>(null);

  const streak = stats?.currentStreak ?? 7;
  const xp = stats?.totalXP ?? 420;
  const level = stats?.level ?? 'Cadet';
  const unlockedBadgeIds = stats?.unlockedBadgeIds ?? ['first_orbit', 'streak_7', 'hyper_focus'];

  // Cadet Level Thresholds
  const LEVEL_THRESHOLDS = {
    Cadet: { next: 'Pilot', min: 0, max: 500 },
    Pilot: { next: 'Commander', min: 500, max: 1500 },
    Commander: { next: 'Astronaut', min: 1500, max: 3000 },
    Astronaut: { next: 'Cosmic Legend', min: 3000, max: 6000 },
  };

  const curThreshold = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS.Cadet;
  const levelProgress = Math.min(
    100,
    Math.max(0, Math.round(((xp - curThreshold.min) / (curThreshold.max - curThreshold.min)) * 100))
  );
  const xpToNext = Math.max(0, curThreshold.max - xp);

  const totalStudyMinutes = studySessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
  const totalStudyHours = (totalStudyMinutes / 60).toFixed(1);
  const completedTopicsCount = topics.filter(t => t.status === 'done').length;

  // Build 52-week activity map for the Heatmap
  const sessionDateMap: Record<string, { minutes: number; count: number }> = {};
  for (const sess of studySessions) {
    if (!sess.dateStr) continue;
    if (!sessionDateMap[sess.dateStr]) {
      sessionDateMap[sess.dateStr] = { minutes: 0, count: 0 };
    }
    sessionDateMap[sess.dateStr].minutes += sess.durationMinutes || 0;
    sessionDateMap[sess.dateStr].count += 1;
  }

  // Generate 52 weeks (364 days ending today)
  const heatmapDays: Array<{ dateStr: string; intensity: number; minutes: number; count: number }> = [];
  const today = new Date();
  for (let i = 363; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const data = sessionDateMap[dateStr] || { minutes: 0, count: 0 };

    let intensity = 0;
    if (data.minutes > 60) intensity = 4;
    else if (data.minutes >= 45) intensity = 3;
    else if (data.minutes >= 25) intensity = 2;
    else if (data.minutes > 0) intensity = 1;

    heatmapDays.push({
      dateStr,
      intensity,
      minutes: data.minutes,
      count: data.count,
    });
  }

  // Slice into 52 columns of 7 days
  const weeks: typeof heatmapDays[] = [];
  for (let w = 0; w < 52; w++) {
    weeks.push(heatmapDays.slice(w * 7, (w + 1) * 7));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white font-sans flex items-center gap-2">
            Progress & Gamification 📊
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            52-week cosmic study heatmap, XP rank progression & unlocked badges.
          </p>
        </div>
      </div>

      {/* Top 4 Metrics Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card variant="bordered" className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500">
            <Flame className="w-5 h-5 fill-amber-500" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-semibold">Active Streak</div>
            <div className="text-base font-extrabold text-slate-900 dark:text-white">
              {streak} Days Active 🔥
            </div>
          </div>
        </Card>

        <Card variant="bordered" className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-neon-cyan/10 text-neon-cyan">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-semibold">Total Orbit XP</div>
            <div className="text-base font-extrabold text-slate-900 dark:text-white">
              {xp} XP • {level}
            </div>
          </div>
        </Card>

        <Card variant="bordered" className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-semibold">Mastery & Hours</div>
            <div className="text-base font-extrabold text-slate-900 dark:text-white">
              {totalStudyHours}h • {completedTopicsCount} Topics
            </div>
          </div>
        </Card>

        <Card variant="bordered" className="p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-neon-purple/10 text-neon-purple">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-slate-400 font-semibold">Badges Earned</div>
            <div className="text-base font-extrabold text-slate-900 dark:text-white">
              {unlockedBadgeIds.length} of {INITIAL_BADGES.length}
            </div>
          </div>
        </Card>
      </div>

      {/* Cadet Rank Level Progression Card */}
      <Card variant="glass" className="p-6 space-y-4 border-neon-cyan/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white text-xl shadow-[0_0_20px_rgba(0,242,254,0.3)]">
              🚀
            </div>
            <div>
              <span className="text-[11px] font-bold text-neon-cyan uppercase tracking-wider">
                Current Astronaut Rank
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Rank: {level}
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400">Next Rank:</span>
            <div className="text-sm font-extrabold text-slate-900 dark:text-white">
              {curThreshold.next} ({xpToNext} XP needed)
            </div>
          </div>
        </div>

        {/* Level Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-400 font-semibold">
            <span>{curThreshold.min} XP</span>
            <span className="text-neon-cyan font-bold">{levelProgress}% Complete</span>
            <span>{curThreshold.max} XP</span>
          </div>
          <div className="h-3 w-full rounded-full bg-slate-200 dark:bg-space-850 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-neon-cyan via-indigo-500 to-neon-purple transition-all duration-700 shadow-[0_0_12px_rgba(0,242,254,0.4)]"
              style={{ width: `${levelProgress}%` }}
            />
          </div>
        </div>
      </Card>

      {/* 52-Week Cosmic Study Heatmap */}
      <Card variant="glass" className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-neon-cyan" />
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              52-Week Cosmic Study Heatmap
            </h3>
          </div>

          {/* Hover Status */}
          <div className="text-xs text-slate-400 h-5">
            {hoveredDay ? (
              <span className="text-neon-cyan font-semibold">
                {hoveredDay.dateStr}: {hoveredDay.minutes} mins ({hoveredDay.sessions} sessions)
              </span>
            ) : (
              <span>Hover over a tile for telemetry</span>
            )}
          </div>
        </div>

        {/* Heatmap Grid Container */}
        <div className="overflow-x-auto pb-2">
          <div className="inline-grid grid-flow-col grid-rows-7 gap-1 min-w-[700px]">
            {heatmapDays.map((day, idx) => {
              let bg = 'bg-slate-200/50 dark:bg-space-850/80';
              if (day.intensity === 1) bg = 'bg-cyan-900/60 dark:bg-cyan-950 border border-cyan-800/40';
              if (day.intensity === 2) bg = 'bg-cyan-700 dark:bg-cyan-800';
              if (day.intensity === 3) bg = 'bg-cyan-500 dark:bg-cyan-500 shadow-[0_0_6px_rgba(0,242,254,0.4)]';
              if (day.intensity === 4) bg = 'bg-neon-cyan dark:bg-neon-cyan shadow-[0_0_10px_rgba(0,242,254,0.7)]';

              return (
                <div
                  key={idx}
                  onMouseEnter={() =>
                    setHoveredDay({
                      dateStr: day.dateStr,
                      minutes: day.minutes,
                      sessions: day.count,
                    })
                  }
                  onMouseLeave={() => setHoveredDay(null)}
                  className={`w-3 h-3 rounded-[3px] transition-transform hover:scale-125 cursor-pointer ${bg}`}
                  title={`${day.dateStr}: ${day.minutes}m (${day.count} sessions)`}
                />
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-end gap-2 text-xs text-slate-400 pt-2 border-t border-slate-200/50 dark:border-space-border/50">
          <span>Less</span>
          <div className="w-3 h-3 rounded-[3px] bg-slate-200/50 dark:bg-space-850" />
          <div className="w-3 h-3 rounded-[3px] bg-cyan-900/60 dark:bg-cyan-950" />
          <div className="w-3 h-3 rounded-[3px] bg-cyan-700 dark:bg-cyan-800" />
          <div className="w-3 h-3 rounded-[3px] bg-cyan-500 dark:bg-cyan-500" />
          <div className="w-3 h-3 rounded-[3px] bg-neon-cyan shadow-[0_0_8px_rgba(0,242,254,0.6)]" />
          <span>More Study</span>
        </div>
      </Card>

      {/* Cosmic Badges Showcase */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-neon-purple" /> Cosmic Badges & Milestones
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {INITIAL_BADGES.map(badge => {
            const isUnlocked = unlockedBadgeIds.includes(badge.id);

            return (
              <Card
                key={badge.id}
                variant={isUnlocked ? 'interactive' : 'bordered'}
                glowColor="cyan"
                className={`p-4 flex items-start gap-3.5 transition-all ${
                  !isUnlocked ? 'opacity-50 grayscale' : 'border-neon-cyan/30'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${
                    isUnlocked
                      ? 'bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 border border-neon-cyan/40 shadow-[0_0_15px_rgba(0,242,254,0.2)]'
                      : 'bg-slate-200 dark:bg-space-850 text-slate-500'
                  }`}
                >
                  {badge.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {badge.name}
                    </h4>
                    {isUnlocked && (
                      <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Unlocked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {badge.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Study Sessions Telemetry Log */}
      <Card variant="glass" className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-400" /> Recent Study Sessions Log
          </h3>
          <span className="text-xs text-slate-400">{studySessions.length} total logs</span>
        </div>

        <div className="divide-y divide-slate-200/50 dark:divide-space-border/50 max-h-80 overflow-y-auto">
          {studySessions.slice(-8).reverse().map(sess => (
            <div key={sess.id} className="py-2.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-neon-cyan/10 text-neon-cyan flex items-center justify-center text-xs font-bold">
                  {sess.type === 'topic' ? '📚' : sess.type === 'hard_skill' ? '⚡' : '⏱'}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                    {sess.title}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{sess.dateStr}</span>
                    <span>•</span>
                    <span>{sess.durationMinutes} mins</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-neon-cyan">+{sess.xpEarned} XP</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
