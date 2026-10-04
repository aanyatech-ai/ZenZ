import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, BookOpen, Calendar, Cpu, BarChart3, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export const MobileNav: React.FC = () => {
  const navItems = [
    { to: '/', label: 'Today', icon: Compass },
    { to: '/syllabus', label: 'Syllabus', icon: BookOpen },
    { to: '/planner', label: 'Planner', icon: Calendar },
    { to: '/skills', label: 'Skills', icon: Cpu },
    { to: '/progress', label: 'Progress', icon: BarChart3 },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-space-950/85 backdrop-blur-xl border-t border-slate-200/80 dark:border-space-border/60 pb-safe px-2 py-2"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 select-none ${
                isActive
                  ? 'text-neon-cyan font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="mobileNavActivePill"
                    className="absolute inset-0 bg-neon-cyan/10 rounded-2xl border border-neon-cyan/30 shadow-[0_0_12px_rgba(0,242,254,0.25)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 relative z-10 transition-transform ${isActive ? 'scale-110' : ''}`} />
                <span className="text-[10px] mt-1 relative z-10 tracking-tight">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
