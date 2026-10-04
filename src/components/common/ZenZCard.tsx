import React from 'react';
import { motion } from 'framer-motion';

interface ZenZCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'glass' | 'pastel' | 'outline' | 'gradient';
  pastelColor?: 'lavender' | 'pink' | 'peach' | 'mint' | 'blue';
  interactive?: boolean;
  onClick?: () => void;
}

export const ZenZCard: React.FC<ZenZCardProps> = ({
  children,
  className = '',
  variant = 'glass',
  pastelColor = 'lavender',
  interactive = false,
  onClick,
}) => {
  const pastelStyles = {
    lavender: 'bg-[#F5F3FF]/90 dark:bg-[#1E1632]/85 border-purple-200/70 dark:border-purple-500/25',
    pink: 'bg-[#FDF2F8]/90 dark:bg-[#281427]/85 border-pink-200/70 dark:border-pink-500/25',
    peach: 'bg-[#FFF7ED]/90 dark:bg-[#2A181A]/85 border-orange-200/70 dark:border-orange-500/25',
    mint: 'bg-[#ECFDF5]/90 dark:bg-[#0D241E]/85 border-emerald-200/70 dark:border-emerald-500/25',
    blue: 'bg-[#F0F9FF]/90 dark:bg-[#0F1E33]/85 border-sky-200/70 dark:border-sky-500/25',
  }[pastelColor];

  const variantStyles = {
    glass:
      'bg-white/80 dark:bg-[#1C162E]/75 backdrop-blur-xl border border-white/80 dark:border-purple-500/20 shadow-[0_12px_32px_-8px_rgba(236,72,153,0.08)] dark:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.5)]',
    pastel: `${pastelStyles} backdrop-blur-md border shadow-[0_10px_25px_-5px_rgba(139,92,246,0.06)]`,
    outline:
      'bg-transparent border border-purple-200/60 dark:border-purple-500/20 hover:border-pink-300 dark:hover:border-purple-400/40',
    gradient:
      'bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 dark:from-purple-900/30 dark:via-pink-900/20 dark:to-orange-900/20 border border-pink-200/60 dark:border-pink-500/30 backdrop-blur-xl shadow-lg',
  }[variant];

  if (interactive) {
    return (
      <motion.div
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.985 }}
        onClick={onClick}
        className={`rounded-3xl p-5 transition-colors cursor-pointer select-none ${variantStyles} ${className}`}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={`rounded-3xl p-5 ${variantStyles} ${className}`}>
      {children}
    </div>
  );
};
