import React from 'react';
import { motion } from 'framer-motion';

interface ProgressRingProps {
  progress: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  gradientStart?: string;
  gradientEnd?: string;
  label?: string;
  sublabel?: string;
  children?: React.ReactNode;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 10,
  gradientStart = '#00f2fe',
  gradientEnd = '#4facfe',
  label,
  sublabel,
  children,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;
  const gradientId = `ring-grad-${gradientStart.replace('#', '')}-${gradientEnd.replace('#', '')}`;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={gradientStart} />
            <stop offset="100%" stopColor={gradientEnd} />
          </linearGradient>
        </defs>
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-200 dark:text-space-800"
          fill="transparent"
        />
        {/* Animated Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
        {children ? (
          children
        ) : (
          <>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {label !== undefined ? label : `${Math.round(clampedProgress)}%`}
            </span>
            {sublabel && (
              <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400">
                {sublabel}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};
