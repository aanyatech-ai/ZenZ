import React, { useState } from 'react';
import { useZenZStore } from '../store/useZenZStore';
import { ZenZCard } from '../components/common/ZenZCard';
import { ZenZPillButton } from '../components/common/ZenZPillButton';
import { ZenZPomodoroModal } from '../components/common/ZenZPomodoroModal';
import {
  Calendar,
  Clock,
  Sparkles,
  RotateCcw,
  Play,
} from 'lucide-react';

export const Planner: React.FC = () => {
  const {
    user,
    updateUserProfile,
    studyBlocks,
    generateTimePlannerBlocks,
    toggleStudyBlock,
    rescheduleMissedBlocks,
  } = useZenZStore();

  const [examDate, setExamDate] = useState(user.examDate || '2026-12-15');
  const [dailyHours, setDailyHours] = useState(user.dailyStudyHours || 4.5);
  const [selectedDay, setSelectedDay] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [focusTopic, setFocusTopic] = useState<{
    isOpen: boolean;
    subjectCode?: string;
    topicTitle?: string;
  }>({ isOpen: false });

  const handleGenerate = () => {
    setIsGenerating(true);
    updateUserProfile({ examDate, dailyStudyHours: dailyHours });
    generateTimePlannerBlocks(examDate, dailyHours);
    setTimeout(() => {
      setIsGenerating(false);
    }, 600);
  };

  // Group blocks by date
  const blocksByDate: Record<string, typeof studyBlocks> = {};
  studyBlocks.forEach((b) => {
    if (!blocksByDate[b.date]) blocksByDate[b.date] = [];
    blocksByDate[b.date].push(b);
  });

  const availableDates = Object.keys(blocksByDate).sort();
  const activeDateBlocks = blocksByDate[selectedDay] || [];
  const todayStr = new Date().toISOString().split('T')[0];

  // Count missed past blocks
  const missedCount = studyBlocks.filter((b) => b.date < todayStr && !b.completed).length;

  return (
    <div className="space-y-6 pb-24 max-w-md md:max-w-4xl mx-auto px-4 pt-4">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white font-sans flex items-center gap-2">
          Time-Based Study Planner ⏱️
        </h2>
        <p className="text-xs text-slate-500 dark:text-purple-300/70 mt-0.5">
          Spreads remaining topics across study blocks with credit weighting.
        </p>
      </div>

      {/* Configuration Card (Exam Date & Daily Study Capacity) */}
      <ZenZCard variant="glass" className="p-5 space-y-4 border-purple-200/70 shadow-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300 flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4 text-pink-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Target Exam Horizon & Daily Capacity
            </h3>
            <p className="text-[11px] text-slate-400">
              Higher credit courses (4 Cr: NCS-301, 302, 304) get more blocks.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
              <Calendar className="w-3.5 h-3.5 text-pink-500" /> Target Exam Date
            </label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-500/30 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-pink-400/30"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between mb-1">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-500" /> Daily Study Capacity
              </span>
              <span className="text-pink-500 font-bold">{dailyHours} Hours/Day</span>
            </label>
            <input
              type="range"
              min="1.5"
              max="12"
              step="0.5"
              value={dailyHours}
              onChange={(e) => setDailyHours(Number(e.target.value))}
              className="w-full mt-2 accent-pink-500 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-purple-100 dark:border-purple-500/20">
          <div className="flex items-center gap-2">
            {missedCount > 0 && (
              <button
                onClick={rescheduleMissedBlocks}
                className="px-3 py-1.5 rounded-full text-xs font-bold text-amber-600 dark:text-amber-300 bg-amber-500/10 border border-amber-400/30 hover:bg-amber-500/20 flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reschedule {missedCount} Missed Block{missedCount > 1 ? 's' : ''}
              </button>
            )}
          </div>

          <ZenZPillButton
            size="sm"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="shadow-md"
          >
            {isGenerating ? 'Generating Plan...' : 'Generate / Refresh Plan'}
          </ZenZPillButton>
        </div>
      </ZenZCard>

      {/* Date Selector Horizontal Scroll */}
      {availableDates.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Study Schedule Days
            </span>
            <span className="text-xs font-semibold text-pink-500">
              {studyBlocks.filter((b) => b.completed).length} of {studyBlocks.length} completed
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {availableDates.map((dateStr) => {
              const d = new Date(dateStr);
              const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
              const dayNum = d.getDate();
              const isSelected = selectedDay === dateStr;
              const isToday = todayStr === dateStr;
              const blocks = blocksByDate[dateStr] || [];
              const allDone = blocks.length > 0 && blocks.every((b) => b.completed);

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDay(dateStr)}
                  className={`shrink-0 px-3.5 py-2 rounded-2xl flex flex-col items-center gap-0.5 border transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md border-pink-400'
                      : isToday
                      ? 'bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-300 border-pink-300'
                      : 'bg-white/80 dark:bg-[#1E1632]/80 text-slate-700 dark:text-slate-300 border-purple-200/60 dark:border-purple-500/20 hover:border-pink-300'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase">{dayName}</span>
                  <span className="text-sm font-black font-sans">{dayNum}</span>
                  <div className="flex gap-1 mt-0.5">
                    {allDone ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-300" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Time Blocks for Selected Day */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
          Time Blocks for {selectedDay === todayStr ? 'Today (Active)' : selectedDay}
        </h4>

        {activeDateBlocks.length === 0 ? (
          <ZenZCard variant="glass" className="p-8 text-center">
            <Sparkles className="w-8 h-8 text-pink-400 mx-auto mb-2 opacity-60" />
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No study blocks generated yet.
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              Tap "Generate / Refresh Plan" above to create automated time slots based on your remaining syllabus.
            </p>
          </ZenZCard>
        ) : (
          <div className="space-y-2.5">
            {activeDateBlocks.map((block) => (
              <ZenZCard
                key={block.id}
                variant="glass"
                className={`p-4 flex items-center justify-between gap-3 border transition-all ${
                  block.completed
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300/40 opacity-70'
                    : 'border-purple-200/70 hover:border-pink-300'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <input
                    type="checkbox"
                    checked={block.completed}
                    onChange={() => toggleStudyBlock(block.id)}
                    className="w-5 h-5 accent-pink-500 rounded-lg cursor-pointer shrink-0"
                  />

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase px-2 py-0.2 rounded bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                        {block.subjectCode}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-pink-500" />
                        {block.startTime} - {block.endTime} (90 min)
                      </span>
                    </div>

                    <h5
                      className={`text-sm font-bold mt-0.5 ${
                        block.completed
                          ? 'line-through text-slate-400'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {block.title}
                    </h5>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() =>
                      setFocusTopic({
                        isOpen: true,
                        subjectCode: block.subjectCode,
                        topicTitle: block.title,
                      })
                    }
                    className="px-3 py-1.5 rounded-full text-xs font-bold bg-pink-500/10 text-pink-600 dark:text-pink-300 hover:bg-pink-500/20 flex items-center gap-1 transition-colors"
                  >
                    <Play className="w-3 h-3 fill-pink-500" />
                    <span>Focus</span>
                  </button>
                </div>
              </ZenZCard>
            ))}
          </div>
        )}
      </div>

      {/* Pomodoro Focus Modal */}
      <ZenZPomodoroModal
        isOpen={focusTopic.isOpen}
        onClose={() => setFocusTopic({ isOpen: false })}
        defaultSubjectCode={focusTopic.subjectCode}
        defaultTopicTitle={focusTopic.topicTitle}
      />
    </div>
  );
};
