import React from 'react';
import { NavLink } from 'react-router-dom';
import { Compass, BookOpen, Calendar, Cpu, BarChart3, Settings, Moon, Sun, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

export const DesktopSidebar: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const navItems = [
    { to: '/', label: 'Today', icon: Compass },
    { to: '/syllabus', label: 'Syllabus', icon: BookOpen },
    { to: '/planner', label: 'Planner', icon: Calendar },
    { to: '/skills', label: 'Skills', icon: Cpu },
    { to: '/progress', label: 'Progress', icon: BarChart3 },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 z-40 bg-white/70 dark:bg-space-950/75 backdrop-blur-2xl border-r border-slate-200/80 dark:border-space-border/60 p-5">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-3 px-2 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-neon-cyan via-indigo-500 to-neon-purple p-0.5 shadow-[0_0_20px_rgba(0,242,254,0.35)]">
          <div className="w-full h-full bg-space-950 rounded-[14px] flex items-center justify-center">
            <span className="text-xl">🚀</span>
          </div>
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent font-sans">
            ORBIT
          </h1>
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
            Mission Control
          </p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 space-y-1.5" aria-label="Desktop Navigation">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `relative flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-medium transition-all select-none ${
                isActive
                  ? 'text-neon-cyan font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/60 dark:hover:bg-space-850/50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="desktopNavActivePill"
                    className="absolute inset-0 bg-neon-cyan/10 rounded-2xl border border-neon-cyan/30 shadow-[0_0_15px_rgba(0,242,254,0.2)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 relative z-10 transition-transform ${isActive ? 'scale-110 text-neon-cyan' : ''}`} />
                <span className="relative z-10">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom theme selector & telemetry status */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-space-border/60">
        <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-100/80 dark:bg-space-900/80 border border-slate-200 dark:border-space-border">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 pl-2">Theme</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setTheme('light')}
              aria-label="Light Theme"
              className={`p-1.5 rounded-xl transition-all ${
                theme === 'light' ? 'bg-white text-amber-500 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              aria-label="Dark Theme"
              className={`p-1.5 rounded-xl transition-all ${
                theme === 'dark' ? 'bg-space-800 text-neon-cyan shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Moon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTheme('system')}
              aria-label="System Theme"
              className={`p-1.5 rounded-xl transition-all ${
                theme === 'system' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
