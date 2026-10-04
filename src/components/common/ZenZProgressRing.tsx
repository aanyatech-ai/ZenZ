import React from 'react';
import { motion } from 'framer-motion';

interface ZenZProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  showPercentage?: boolean;
}

export const ZenZProgressRing: React.FC<ZenZProgressRingProps> = ({
  progress,
  size = 130,
  strokeWidth = 11,
  label,
  sublabel,
  showPercentage = true,
}) => {
  const normalizedProgress = Math.max(0, Math.min(100, Math.round(progress)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedProgress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <defs>
          <linearGradient id="zenzRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="50%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
        </defs>

        {/* Background track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-purple-100/80 dark:text-purple-950/60"
        />

        {/* Animated Gradient Progress Arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#zenzRingGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>

      {/* Center Label Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
        {showPercentage && (
          <motion.span
            key={normalizedProgress}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-2xl font-black tracking-tight text-slate-800 dark:text-white font-sans"
          >
            {normalizedProgress}%
          </motion.span>
        )}
        {label && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-300">
            {label}
          </span>
        )}
        {sublabel && (
          <span className="text-[9px] text-slate-400 mt-0.5 max-w-[80px] truncate">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};
