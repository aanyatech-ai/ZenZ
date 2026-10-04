import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useZenZStore } from '../store/useZenZStore';
import { ZenZCard } from '../components/common/ZenZCard';
import { ZenZPillButton } from '../components/common/ZenZPillButton';
import { ZenZMascot } from '../components/common/ZenZMascot';
import {
  Moon,
  Sun,
  Monitor,
  Download,
  Upload,
  RotateCcw,
  CheckCircle2,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

export const Profile: React.FC = () => {
  const {
    user,
    updateUserProfile,
    setTheme,
    skills,
    addSkillTask,
    toggleSkillTask,
    deleteSkillTask,
    subjects,
    resetToSemester3Seed,
    exportStateToJson,
    importStateFromJson,
  } = useZenZStore();

  const [name, setName] = useState(user.name);
  const [examDate, setExamDate] = useState(user.examDate);
  const [dailyHours, setDailyHours] = useState(user.dailyStudyHours);
  const [reminderTime, setReminderTime] = useState(user.dailyReminderTime || '09:00');
  const [statusMsg, setStatusMsg] = useState('');

  // Skill task creation modal
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [skillTitle, setSkillTitle] = useState('');
  const [skillType, setSkillType] = useState<'soft' | 'hard'>('hard');
  const [skillCategory, setSkillCategory] = useState('');
  const [skillDesc, setSkillDesc] = useState('');
  const [skillDuration, setSkillDuration] = useState(30);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      examDate,
      dailyStudyHours: dailyHours,
      dailyReminderTime: reminderTime,
    });
    setStatusMsg('Profile & study preferences saved! 🌸');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillTitle.trim()) return;

    addSkillTask({
      title: skillTitle.trim(),
      type: skillType,
      category: skillCategory.trim() || (skillType === 'hard' ? 'Coding' : 'Daily Habit'),
      description: skillDesc.trim() || 'Daily deliberate practice session.',
      durationMin: Number(skillDuration) || 30,
      frequency: 'daily',
      done: false,
    });

    setIsSkillModalOpen(false);
    setSkillTitle('');
    setSkillCategory('');
    setSkillDesc('');
  };

  // Export JSON backup
  const handleExport = () => {
    const jsonStr = exportStateToJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zenz_study_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMsg('Backup downloaded! 🚀');
    setTimeout(() => setStatusMsg(''), 3000);
  };

  // Import JSON backup
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const success = importStateFromJson(text);
      if (success) {
        setStatusMsg('ZenZ data restored successfully! 🎉');
        setTimeout(() => setStatusMsg(''), 3000);
      } else {
        alert('Invalid or corrupted backup JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Re-seed Semester III
  const handleReseed = () => {
    if (confirm('Reset to initial Semester III syllabus and demo data?')) {
      resetToSemester3Seed();
      setStatusMsg('Semester III data reloaded! 🌸');
      setTimeout(() => setStatusMsg(''), 3000);
    }
  };

  // Recharts Data: Subject Completion
  const subjectChartData = subjects
    .filter((s) => s.type === 'theory')
    .map((s) => {
      let total = 0;
      let done = 0;
      s.units.forEach((u) => {
        u.topics.forEach((t) => {
          total++;
          if (t.status === 'done') done++;
        });
      });
      return {
        name: s.code.replace('NEC-', '').replace('NCS-', '').replace('NAI-', ''),
        fullName: s.name,
        done,
        total,
        percentage: total > 0 ? Math.round((done / total) * 100) : 0,
        color: s.color,
      };
    });

  // Recharts Data: Weekly Study Hours (from pomodoro logs or defaults)
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weeklyHoursData = daysOfWeek.map((day, idx) => ({
    day,
    hours: [3.5, 4.0, 5.0, 4.5, 3.0, 5.5, 4.2][idx],
  }));

  const softSkills = skills.filter((s) => s.type === 'soft');
  const hardSkills = skills.filter((s) => s.type === 'hard');

  return (
    <div className="space-y-6 pb-24 max-w-md md:max-w-4xl mx-auto px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white font-sans flex items-center gap-2">
            Profile & Skills Sanctuary 🌸
          </h2>
          <p className="text-xs text-slate-500 dark:text-purple-300/70 mt-0.5">
            Cadet telemetry, daily soft & hard skills, and study analytics.
          </p>
        </div>

        <ZenZMascot size="sm" showBubble={false} />
      </div>

      {statusMsg && (
        <div className="p-3 rounded-2xl bg-pink-500/10 border border-pink-400/40 text-pink-600 dark:text-pink-300 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* STATS OVERVIEW: Weekly Study Hours & Subject Progress Chart */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          Study Performance Analytics 📊
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Chart 1: Subject Progress Percentage */}
          <ZenZCard variant="glass" className="p-4 space-y-2">
            <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Subject Progress Completion (%)
            </h5>
            <div className="h-44 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectChartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#A855F7' }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#A855F7' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E1632',
                      borderRadius: '16px',
                      border: '1px solid rgba(236,72,153,0.3)',
                      fontSize: '11px',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="percentage" radius={[8, 8, 0, 0]}>
                    {subjectChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ZenZCard>

          {/* Chart 2: Weekly Study Hours */}
          <ZenZCard variant="glass" className="p-4 space-y-2">
            <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Weekly Study Hours (Daily Average: {user.dailyStudyHours}h)
            </h5>
            <div className="h-44 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyHoursData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#A855F7' }} />
                  <YAxis domain={[0, 8]} tick={{ fontSize: 10, fill: '#A855F7' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1E1632',
                      borderRadius: '16px',
                      border: '1px solid rgba(236,72,153,0.3)',
                      fontSize: '11px',
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="hours" fill="#EC4899" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ZenZCard>
        </div>
      </div>

      {/* SOFT SKILLS DAILY PRACTICE */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-pink-500">
              Soft Skills Daily Micro-Missions 🎙️
            </h4>
            <p className="text-[11px] text-slate-400">
              Communication, presentation, time management, and teamwork habits.
            </p>
          </div>
          <button
            onClick={() => {
              setSkillType('soft');
              setIsSkillModalOpen(true);
            }}
            className="text-xs font-bold text-pink-500 hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Task
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {softSkills.map((task) => (
            <ZenZCard
              key={task.id}
              variant="glass"
              className={`p-4 flex items-start justify-between gap-3 border transition-all ${
                task.done
                  ? 'border-emerald-300/40 bg-emerald-50/40 dark:bg-emerald-950/20'
                  : 'border-purple-200/60'
              }`}
            >
              <div
                onClick={() => toggleSkillTask(task.id)}
                className="flex items-start gap-3 cursor-pointer flex-1"
              >
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => {}}
                  className="w-4 h-4 mt-0.5 accent-pink-500 rounded cursor-pointer shrink-0"
                />
                <div>
                  <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-300">
                    {task.category} • {task.durationMin}m
                  </span>
                  <h5
                    className={`text-xs sm:text-sm font-bold mt-0.5 ${
                      task.done ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {task.title}
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-purple-300/70 mt-0.5">
                    {task.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => deleteSkillTask(task.id)}
                className="text-slate-400 hover:text-rose-500 p-1 rounded"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </ZenZCard>
          ))}
        </div>
      </div>

      {/* HARD SKILLS DAILY TRACK (DSA, Java, Python, SQL) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-300">
              Hard Skills & Coding Mastery 💻
            </h4>
            <p className="text-[11px] text-slate-400">
              DSA practice, Java OOP, Python AI & SQL queries with daily time targets.
            </p>
          </div>
          <button
            onClick={() => {
              setSkillType('hard');
              setIsSkillModalOpen(true);
            }}
            className="text-xs font-bold text-pink-500 hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Skill Task
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {hardSkills.map((task) => (
            <ZenZCard
              key={task.id}
              variant="glass"
              className={`p-4 flex items-start justify-between gap-3 border transition-all ${
                task.done
                  ? 'border-emerald-300/40 bg-emerald-50/40 dark:bg-emerald-950/20'
                  : 'border-purple-200/60'
              }`}
            >
              <div
                onClick={() => toggleSkillTask(task.id)}
                className="flex items-start gap-3 cursor-pointer flex-1"
              >
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => {}}
                  className="w-4 h-4 mt-0.5 accent-pink-500 rounded cursor-pointer shrink-0"
                />
                <div>
                  <span className="text-[10px] font-black uppercase text-pink-600 dark:text-pink-300">
                    {task.category} • {task.durationMin}m / day
                  </span>
                  <h5
                    className={`text-xs sm:text-sm font-bold mt-0.5 ${
                      task.done ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {task.title}
                  </h5>
                  <p className="text-[11px] text-slate-500 dark:text-purple-300/70 mt-0.5">
                    {task.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => deleteSkillTask(task.id)}
                className="text-slate-400 hover:text-rose-500 p-1 rounded"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </ZenZCard>
          ))}
        </div>
      </div>

      {/* THEME CONTROL CARD */}
      <ZenZCard variant="glass" className="p-6 space-y-3 border-purple-200/70">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Visual Theme Preference
        </h4>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setTheme('light')}
            className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
              user.theme === 'light'
                ? 'border-amber-500/50 bg-amber-500/10 text-amber-500 font-bold'
                : 'border-purple-200/60 text-slate-400 hover:text-slate-600'
            }`}
          >
            <Sun className="w-5 h-5" />
            <span className="text-xs">Pastel Light</span>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
              user.theme === 'dark'
                ? 'border-pink-500/50 bg-pink-500/15 text-pink-400 font-bold shadow-[0_0_12px_rgba(236,72,153,0.2)]'
                : 'border-purple-200/60 text-slate-400 hover:text-slate-600'
            }`}
          >
            <Moon className="w-5 h-5" />
            <span className="text-xs">Cosmic Night</span>
          </button>

          <button
            onClick={() => setTheme('system')}
            className={`p-3.5 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
              user.theme === 'system'
                ? 'border-purple-500/50 bg-purple-500/15 text-purple-400 font-bold'
                : 'border-purple-200/60 text-slate-400 hover:text-slate-600'
            }`}
          >
            <Monitor className="w-5 h-5" />
            <span className="text-xs">Follow System</span>
          </button>
        </div>
      </ZenZCard>

      {/* EDIT PROFILE & REMINDER PREFERENCES */}
      <ZenZCard variant="glass" className="p-6 space-y-4 border-purple-200/70">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Cadet Profile & Exam Settings
        </h4>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Cadet Call-Sign / Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-500/30 text-slate-800 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Semester III Exam Target Date
              </label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-500/30 text-slate-800 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Daily Study Hours Capacity
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="14"
                value={dailyHours}
                onChange={(e) => setDailyHours(Number(e.target.value))}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-500/30 text-slate-800 dark:text-white outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Daily Topic Nudge Reminder Time
              </label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-500/30 text-slate-800 dark:text-white outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <ZenZPillButton size="sm" type="submit">
              Save Preferences
            </ZenZPillButton>
          </div>
        </form>
      </ZenZCard>

      {/* DATA BACKUP & RESET CARD */}
      <ZenZCard variant="glass" className="p-6 space-y-4 border-purple-200/70">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Data Engine & Backup Storage
        </h4>
        <p className="text-xs text-slate-500 dark:text-purple-300/70 leading-relaxed">
          ZenZ is 100% offline-first. Your entire curriculum progress, notes, study blocks, and calendar events are stored locally and can be exported as a JSON file or restored on another device.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <ZenZPillButton
            variant="secondary"
            size="sm"
            onClick={handleExport}
            showArrow={false}
            icon={<Download className="w-3.5 h-3.5 text-pink-500" />}
          >
            Export Backup (JSON)
          </ZenZPillButton>

          <label className="cursor-pointer">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-200 dark:border-purple-500/30 hover:bg-white/60 dark:hover:bg-white/10 text-xs font-bold text-slate-700 dark:text-purple-200 transition-colors">
              <Upload className="w-3.5 h-3.5 text-purple-500" />
              Restore Backup
            </span>
          </label>

          <button
            onClick={handleReseed}
            className="px-4 py-2 rounded-full border border-orange-200 dark:border-orange-500/30 text-orange-600 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reload Semester III Seed Data
          </button>
        </div>
      </ZenZCard>

      {/* ADD SKILL TASK MODAL */}
      <AnimatePresence>
        {isSkillModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="w-full max-w-md"
            >
              <ZenZCard variant="glass" className="p-6 relative border-purple-300/40">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                  Add {skillType === 'soft' ? 'Soft Skill Habit' : 'Hard Skill Task'}
                </h3>

                <form onSubmit={handleAddSkill} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Task Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. LeetCode Trees Practice"
                      value={skillTitle}
                      onChange={(e) => setSkillTitle(e.target.value)}
                      required
                      className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 text-slate-800 dark:text-white outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. DSA, Java, Public Speaking"
                        value={skillCategory}
                        onChange={(e) => setSkillCategory(e.target.value)}
                        className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 text-slate-800 dark:text-white outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Daily Duration (Min)
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="180"
                        step="5"
                        value={skillDuration}
                        onChange={(e) => setSkillDuration(Number(e.target.value))}
                        className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 text-slate-800 dark:text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Action Description
                    </label>
                    <textarea
                      rows={2}
                      placeholder="What exactly will you do during this practice block?"
                      value={skillDesc}
                      onChange={(e) => setSkillDesc(e.target.value)}
                      className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 text-slate-800 dark:text-white outline-none resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsSkillModalOpen(false)}
                      className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-slate-600"
                    >
                      Cancel
                    </button>
                    <ZenZPillButton type="submit" size="sm">
                      Save Task
                    </ZenZPillButton>
                  </div>
                </form>
              </ZenZCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
