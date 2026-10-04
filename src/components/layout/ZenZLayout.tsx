import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { ZenZHeader } from './ZenZHeader';
import { ZenZBottomNav } from './ZenZBottomNav';
import { ZenZPomodoroModal } from '../common/ZenZPomodoroModal';
import { motion, AnimatePresence } from 'framer-motion';
import { useZenZStore } from '../../store/useZenZStore';
import { Bell, X } from 'lucide-react';

export const ZenZLayout: React.FC = () => {
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const { calendarEvents } = useZenZStore();

  const todayStr = new Date().toISOString().split('T')[0];
  const todayEvents = calendarEvents.filter((e) => e.date === todayStr);

  return (
    <div className="min-h-screen bg-[#FAF7FD] dark:bg-[#0D091A] text-slate-800 dark:text-slate-100 flex flex-col relative selection:bg-pink-400/25 selection:text-pink-600">
      {/* Soft Pastel Ambient Background Mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-purple-300/30 dark:bg-purple-900/15 blur-[100px]" />
        <div className="absolute top-1/4 -right-32 w-96 h-96 rounded-full bg-pink-300/30 dark:bg-pink-900/15 blur-[100px]" />
        <div className="absolute bottom-10 left-1/3 w-96 h-96 rounded-full bg-orange-200/30 dark:bg-orange-950/15 blur-[100px]" />
      </div>

      {/* Global In-App Reminder Banner (if any event today) */}
      <AnimatePresence>
        {showBanner && todayEvents.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="relative z-30 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-sm"
          >
            <div className="max-w-md md:max-w-4xl mx-auto flex items-center gap-2">
              <Bell className="w-3.5 h-3.5 animate-bounce shrink-0" />
              <span>
                <strong>Reminder for Today:</strong> {todayEvents[0].title} (
                {todayEvents[0].category})
              </span>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="p-1 rounded-full hover:bg-white/20 text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Header */}
      <ZenZHeader onOpenPomodoro={() => setIsPomodoroOpen(true)} />

      {/* Main Screen Outlet with Page Transition */}
      <main className="flex-1 relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Outlet />
        </motion.div>
      </main>

      {/* Mobile-first Bottom Navigation Dock */}
      <ZenZBottomNav />

      {/* Global Pomodoro Focus Modal */}
      <ZenZPomodoroModal
        isOpen={isPomodoroOpen}
        onClose={() => setIsPomodoroOpen(false)}
      />
    </div>
  );
};
