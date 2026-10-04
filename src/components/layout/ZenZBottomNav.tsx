import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  BookOpen,
  CalendarDays,
  FileText,
  User,
  Sparkles,
} from 'lucide-react';

export const ZenZBottomNav: React.FC = () => {
  const navTabs = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/syllabus', label: 'Syllabus', icon: BookOpen },
    { to: '/planner', label: 'Planner', icon: Sparkles },
    { to: '/calendar', label: 'Calendar', icon: CalendarDays },
    { to: '/notes', label: 'Notes', icon: FileText },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 pb-safe pt-1.5 px-3 bg-white/75 dark:bg-[#130E24]/85 backdrop-blur-2xl border-t border-purple-200/50 dark:border-purple-500/20 shadow-[0_-8px_30px_rgba(236,72,153,0.06)]"
    >
      <div className="max-w-md mx-auto flex items-center justify-around py-1">
        {navTabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center py-1.5 px-2.5 rounded-2xl transition-all duration-200 select-none ${
                isActive
                  ? 'text-pink-600 dark:text-pink-400 font-bold'
                  : 'text-slate-400 dark:text-slate-500 hover:text-purple-600 dark:hover:text-purple-300'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="zenzNavActivePill"
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/15 via-pink-500/15 to-orange-500/15 dark:from-purple-500/25 dark:to-pink-500/25 rounded-2xl border border-pink-400/30 shadow-[0_0_15px_rgba(236,72,153,0.2)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  />
                )}
                <Icon
                  className={`w-5 h-5 relative z-10 transition-transform ${
                    isActive ? 'scale-110 stroke-[2.4] text-pink-500' : 'stroke-[1.8]'
                  }`}
                />
                <span className="text-[10px] mt-1 relative z-10 tracking-tight">
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
