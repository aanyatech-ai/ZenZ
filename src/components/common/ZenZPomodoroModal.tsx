import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZenZCard } from './ZenZCard';
import { ZenZPillButton } from './ZenZPillButton';
import { useZenZStore } from '../../store/useZenZStore';
import { X, Play, Pause, RotateCcw, Coffee } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ZenZPomodoroModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubjectCode?: string;
  defaultTopicTitle?: string;
}

export const ZenZPomodoroModal: React.FC<ZenZPomodoroModalProps> = ({
  isOpen,
  onClose,
  defaultSubjectCode,
  defaultTopicTitle,
}) => {
  const { logPomodoro, subjects } = useZenZStore();

  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [durationMinutes, setDurationMinutes] = useState<number>(25);
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedSubject, setSelectedSubject] = useState<string>(
    defaultSubjectCode || (subjects[0]?.code ?? 'NCS-301')
  );

  useEffect(() => {
    setSecondsLeft(durationMinutes * 60);
    setIsRunning(false);
  }, [durationMinutes, mode]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      } catch {}

      if (mode === 'focus') {
        logPomodoro(durationMinutes, selectedSubject);
      }
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, secondsLeft, mode, durationMinutes, selectedSubject, logPomodoro]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const totalSeconds = durationMinutes * 60;
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 10 }}
          className="w-full max-w-sm"
        >
          <ZenZCard variant="glass" className="p-6 relative text-center border-purple-300/40">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header / Mode pills */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <button
                onClick={() => {
                  setMode('focus');
                  setDurationMinutes(25);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  mode === 'focus'
                    ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white shadow-md'
                    : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                }`}
              >
                Deep Focus (25m)
              </button>
              <button
                onClick={() => {
                  setMode('break');
                  setDurationMinutes(5);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  mode === 'break'
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-md'
                    : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                }`}
              >
                <span className="flex items-center gap-1">
                  <Coffee className="w-3 h-3" /> Break (5m)
                </span>
              </button>
            </div>

            {/* Subject Selector (if focus) */}
            {mode === 'focus' && (
              <div className="mb-4 text-left">
                <label className="text-[11px] font-bold text-slate-400 dark:text-purple-300/70 uppercase tracking-wider block mb-1">
                  Studying Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-500/30 text-slate-800 dark:text-white outline-none"
                >
                  {subjects.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.code}: {s.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {defaultTopicTitle && (
              <p className="text-xs text-pink-600 dark:text-pink-300 font-medium mb-3">
                Focusing on: {defaultTopicTitle}
              </p>
            )}

            {/* Big Circular Clock Display */}
            <div className="relative my-4 flex items-center justify-center">
              <svg width={180} height={180} className="rotate-[-90deg]">
                <circle
                  cx={90}
                  cy={90}
                  r={76}
                  stroke="currentColor"
                  strokeWidth={10}
                  fill="transparent"
                  className="text-purple-100 dark:text-purple-950/60"
                />
                <circle
                  cx={90}
                  cy={90}
                  r={76}
                  stroke={mode === 'focus' ? '#EC4899' : '#10B981'}
                  strokeWidth={10}
                  strokeDasharray={2 * Math.PI * 76}
                  strokeDashoffset={2 * Math.PI * 76 - (progress / 100) * 2 * Math.PI * 76}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-300"
                />
              </svg>

              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black font-sans tracking-tight text-slate-900 dark:text-white">
                  {timeFormatted}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">
                  {isRunning ? 'Timer Running' : secondsLeft === 0 ? 'Completed! 🎉' : 'Paused'}
                </span>
              </div>
            </div>

            {/* Play / Pause / Reset Controls */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                onClick={() => {
                  setSecondsLeft(durationMinutes * 60);
                  setIsRunning(false);
                }}
                className="p-3 rounded-full bg-slate-100 dark:bg-purple-950/50 text-slate-500 dark:text-purple-300 hover:bg-slate-200 transition-colors"
                title="Reset timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <ZenZPillButton
                onClick={() => setIsRunning(!isRunning)}
                size="md"
                showArrow={false}
                icon={isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                className="min-w-[130px]"
              >
                {isRunning ? 'Pause' : 'Start Focus'}
              </ZenZPillButton>
            </div>
          </ZenZCard>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
