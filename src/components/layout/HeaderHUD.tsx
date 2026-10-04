import React, { useState, useEffect } from 'react';
import { Flame, Sparkles, Calendar, Search, Sun, Moon, User } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useLiveQuery } from 'dexie-react-hooks';
import { localDb } from '../../db/orbitDexie';
import { orbitSync, type SyncState } from '../../db/orbitSync';
import { SearchModal } from '../common/SearchModal';
import { FocusModal } from '../common/FocusModal';
import { AuthModal } from '../common/AuthModal';
import { useNavigate } from 'react-router-dom';
import type { GamificationStats } from '../../types/gamification';
import type { UserProfile } from '../../types/auth';

export const HeaderHUD: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [focusModalData, setFocusModalData] = useState<{ isOpen: boolean; topicId?: string; title?: string }>({
    isOpen: false,
  });

  const [syncState, setSyncState] = useState<SyncState>(orbitSync.getStatus());

  useEffect(() => {
    const unsub = orbitSync.subscribe(s => setSyncState(s));
    return () => unsub();
  }, []);

  const stats = useLiveQuery(
    () => localDb.gamification.get('default_cadet') as Promise<(GamificationStats & { uid: string }) | undefined>,
    []
  );

  const profile = useLiveQuery(
    () => localDb.profile.get('default_cadet') as Promise<UserProfile | undefined>,
    []
  );

  const streak = stats?.currentStreak ?? 7;
  const xp = stats?.totalXP ?? 420;
  const level = stats?.level ?? 'Cadet';

  // Compute countdown & greeting safely
  const today = new Date();
  const hour = today.getHours();
  const cadetName = profile?.name ? profile.name.split(' ')[0] : 'Cadet';
  const greeting = hour < 12 ? `Good morning, ${cadetName} 👋` : hour < 17 ? `Good afternoon, ${cadetName} 👋` : `Good evening, ${cadetName} 👋`;

  const formattedDate = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(today);

  let countdownText = 'Exam in 42 days';
  if (profile?.examDate) {
    const examTime = new Date(profile.examDate).getTime();
    const diffDays = Math.ceil((examTime - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays > 0) {
      countdownText = `${profile.examName ? profile.examName.slice(0, 15) : 'Exam'} in ${diffDays}d`;
    } else if (diffDays === 0) {
      countdownText = 'Exam Today! 🎯';
    } else {
      countdownText = 'Exam passed';
    }
  }

  const handleProfileClick = () => {
    if (currentUser) {
      navigate('/settings');
    } else {
      setIsAuthOpen(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/70 dark:bg-space-950/70 backdrop-blur-xl border-b border-slate-200/80 dark:border-space-border/60 px-4 py-3 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Cadet Greeting & Date */}
          <div>
            <h2 className="text-base md:text-lg font-bold text-slate-900 dark:text-white tracking-tight font-sans">
              {greeting}
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                {formattedDate}
              </span>
              <span className="text-slate-300 dark:text-space-border">•</span>
              {/* Exam Countdown Tag */}
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-neon-blue/10 text-neon-blue border border-neon-blue/20">
                {countdownText}
              </span>
            </div>
          </div>

          {/* Telemetry Stats Pill (Level, XP, Streak) & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak Badge */}
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-500 dark:text-amber-400 text-xs font-bold shadow-[0_0_12px_rgba(245,158,11,0.15)]"
              title="Continuous Study Streak"
            >
              <Flame className="w-4 h-4 text-amber-500 animate-pulse fill-amber-500" />
              <span>{streak}</span>
              <span className="hidden sm:inline font-medium text-[11px] text-amber-600/80 dark:text-amber-300/80">days</span>
            </div>

            {/* XP & Level Badge */}
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-neon-purple/10 border border-neon-purple/30 text-neon-purple dark:text-purple-300 text-xs font-bold"
              title="Cosmic Rank & Total XP"
            >
              <Sparkles className="w-3.5 h-3.5 text-neon-purple" />
              <span>{xp} XP</span>
              <span className="hidden md:inline px-1.5 py-0.2 bg-neon-purple/20 rounded text-[10px] uppercase tracking-wider text-purple-200">
                {level}
              </span>
            </div>

            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Global Search"
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-neon-cyan hover:bg-slate-100 dark:hover:bg-space-850/60 transition-all border border-transparent hover:border-neon-cyan/30"
              title="Search (Cmd+K)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="lg:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-space-850/60 transition-all"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-500" />}
            </button>

            {/* Cadet Cloud Profile / Auth Button */}
            <button
              onClick={handleProfileClick}
              aria-label="Cadet Account"
              title={currentUser ? `Signed in as ${currentUser.displayName || currentUser.email}` : 'Sign In to Orbit Cloud'}
              className="relative p-1 rounded-xl border border-slate-200 dark:border-space-border hover:border-neon-cyan/50 transition-all flex items-center gap-1.5 pl-1.5 pr-2 bg-slate-100/60 dark:bg-space-900/60"
            >
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt="Cadet"
                  className="w-6 h-6 rounded-lg object-cover"
                />
              ) : (
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-neon-cyan to-neon-purple flex items-center justify-center text-[10px] font-bold text-space-950">
                  {currentUser ? (currentUser.displayName || currentUser.email || 'C')[0].toUpperCase() : <User className="w-3.5 h-3.5 text-space-950" />}
                </div>
              )}

              {/* Status indicator dot */}
              <span className="relative flex h-2 w-2">
                {syncState === 'syncing' ? (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75" />
                ) : null}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    syncState === 'synced'
                      ? 'bg-emerald-400'
                      : syncState === 'syncing'
                      ? 'bg-neon-cyan'
                      : syncState === 'offline'
                      ? 'bg-amber-400'
                      : 'bg-slate-400'
                  }`}
                />
              </span>

              {!currentUser && (
                <span className="text-[11px] font-semibold text-neon-cyan hidden sm:inline">
                  Sign In
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Global Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectTopic={(topicId, title) => {
          setFocusModalData({ isOpen: true, topicId, title });
        }}
      />

      <FocusModal
        isOpen={focusModalData.isOpen}
        onClose={() => setFocusModalData({ isOpen: false })}
        topicId={focusModalData.topicId}
        defaultTitle={focusModalData.title || 'Cosmic Deep Focus'}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </>
  );
};
