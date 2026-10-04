import React from 'react';
import { motion } from 'framer-motion';
import { ZenZMascot } from '../components/common/ZenZMascot';
import { ZenZPillButton } from '../components/common/ZenZPillButton';
import { Sparkles, BookOpen, Calendar, Clock } from 'lucide-react';

interface SplashOnboardingProps {
  onGetStarted: () => void;
}

export const SplashOnboarding: React.FC<SplashOnboardingProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 max-w-md mx-auto text-center relative overflow-hidden">
      {/* Soft Pastel Background Blobs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-purple-300/30 dark:bg-purple-900/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-72 h-72 rounded-full bg-pink-300/30 dark:bg-pink-900/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/4 w-72 h-72 rounded-full bg-orange-200/30 dark:bg-orange-950/20 blur-3xl pointer-events-none" />

      {/* Top Header Tag */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-8"
      >
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/70 dark:bg-[#1E1632]/80 border border-purple-200/60 dark:border-purple-500/30 text-xs font-bold text-purple-700 dark:text-purple-300 shadow-sm backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          <span>B.Tech CSE (AI) • Semester III</span>
        </div>
      </motion.div>

      {/* Central Mascot & Title */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.6 }}
        className="my-auto flex flex-col items-center"
      >
        <ZenZMascot size="lg" quote="Welcome Aanya! Let's study peacefully 🌸" />

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mt-6 font-sans">
          <span className="bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] bg-clip-text text-transparent">
            ZenZ
          </span>
        </h1>

        <p className="text-sm font-semibold text-slate-600 dark:text-purple-200/80 mt-2 max-w-xs">
          Your aesthetic personal study companion, syllabus planner & memory keeper.
        </p>

        {/* Feature Pills */}
        <div className="grid grid-cols-3 gap-2 mt-6 max-w-xs w-full text-[11px] font-bold text-slate-600 dark:text-slate-300">
          <div className="p-2.5 rounded-2xl bg-white/60 dark:bg-[#1C162E]/70 border border-purple-100 dark:border-purple-500/20 flex flex-col items-center gap-1 backdrop-blur-sm">
            <BookOpen className="w-4 h-4 text-pink-500" />
            <span>Syllabus</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/60 dark:bg-[#1C162E]/70 border border-purple-100 dark:border-purple-500/20 flex flex-col items-center gap-1 backdrop-blur-sm">
            <Clock className="w-4 h-4 text-purple-500" />
            <span>Planner</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white/60 dark:bg-[#1C162E]/70 border border-purple-100 dark:border-purple-500/20 flex flex-col items-center gap-1 backdrop-blur-sm">
            <Calendar className="w-4 h-4 text-orange-500" />
            <span>Calendar</span>
          </div>
        </div>
      </motion.div>

      {/* Bottom CTA Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="w-full pb-8"
      >
        <ZenZPillButton
          size="lg"
          onClick={onGetStarted}
          className="w-full shadow-xl"
        >
          Get Started
        </ZenZPillButton>
      </motion.div>
    </div>
  );
};
