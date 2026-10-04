import React from 'react';
import { useZenZStore } from '../../store/useZenZStore';
import { Flame, Bell, Moon, Sun, Timer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ZenZHeaderProps {
  onOpenPomodoro?: () => void;
}

export const ZenZHeader: React.FC<ZenZHeaderProps> = ({ onOpenPomodoro }) => {
  const { user, setTheme } = useZenZStore();
  const navigate = useNavigate();

  const isDark =
    user.theme === 'dark' ||
    (user.theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const handleNotifyRequest = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        new Notification('ZenZ Study Tracker 🌸', {
          body: `Hi ${user.name}! Ready for your daily focus blocks? Let\'s conquer Semester III! ✨`,
          icon: '/favicon.svg',
        });
      }
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/70 dark:bg-[#130E24]/75 backdrop-blur-xl border-b border-purple-200/40 dark:border-purple-500/15 px-4 py-3">
      <div className="max-w-md md:max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Logo "ZenZ" in gradient style */}
        <div
          onClick={() => navigate('/')}
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] via-[#EC4899] to-[#F97316] p-0.5 shadow-[0_4px_14px_rgba(236,72,153,0.3)]">
            <div className="w-full h-full bg-white dark:bg-[#130E24] rounded-[14px] flex items-center justify-center">
              <span className="text-sm">🌸</span>
            </div>
          </div>
          <div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent font-sans">
              ZenZ
            </span>
            <span className="text-[10px] font-semibold text-slate-400 dark:text-purple-300/70 ml-1.5 hidden sm:inline">
              Study Tracker
            </span>
          </div>
        </div>

        {/* Action badges: Streak, Pomodoro, Notification, Theme */}
        <div className="flex items-center gap-2">
          {/* 7-day streak badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 dark:bg-orange-500/20 border border-orange-400/30 text-orange-600 dark:text-orange-400 text-xs font-bold shadow-sm"
            title="Continuous Study Streak"
          >
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-500 animate-pulse" />
            <span>{user.streakDays || 7}d</span>
          </div>

          {/* Quick Pomodoro button */}
          {onOpenPomodoro && (
            <button
              onClick={onOpenPomodoro}
              aria-label="Pomodoro Timer"
              title="Quick Pomodoro Focus"
              className="p-2 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-300/30 hover:bg-purple-500/20 transition-colors"
            >
              <Timer className="w-4 h-4" />
            </button>
          )}

          {/* Notification reminder trigger */}
          <button
            onClick={handleNotifyRequest}
            aria-label="Send reminder"
            title="Enable & test study reminders"
            className="p-2 rounded-2xl bg-pink-500/10 dark:bg-pink-500/20 text-pink-600 dark:text-pink-300 border border-pink-300/30 hover:bg-pink-500/20 transition-colors"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2 rounded-2xl bg-white/80 dark:bg-[#1E1632] text-slate-600 dark:text-purple-200 border border-purple-200/50 dark:border-purple-500/30 hover:bg-slate-100 dark:hover:bg-[#271E40] transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
