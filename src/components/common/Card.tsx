import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'glass' | 'interactive' | 'telemetry' | 'bordered';
  glowColor?: 'cyan' | 'purple' | 'amber' | 'emerald';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'glass',
  glowColor = 'cyan',
  children,
  className = '',
  ...props
}) => {
  const glowStyles = {
    cyan: 'hover:shadow-[0_8px_30px_-6px_rgba(0,242,254,0.25)] hover:border-neon-cyan/40',
    purple: 'hover:shadow-[0_8px_30px_-6px_rgba(157,78,221,0.25)] hover:border-neon-purple/40',
    amber: 'hover:shadow-[0_8px_30px_-6px_rgba(251,191,36,0.25)] hover:border-neon-amber/40',
    emerald: 'hover:shadow-[0_8px_30px_-6px_rgba(16,185,129,0.25)] hover:border-neon-emerald/40',
  }[glowColor];

  const variantClasses = {
    glass: 'glass-panel rounded-2xl p-4 md:p-5',
    interactive: `glass-panel-interactive rounded-2xl p-4 md:p-5 cursor-pointer ${glowStyles}`,
    telemetry: 'glass-panel rounded-2xl p-4 md:p-5 border-l-4 border-l-neon-cyan',
    bordered: 'border border-space-border bg-slate-900/40 rounded-2xl p-4 md:p-5 backdrop-blur-md',
  }[variant];

  return (
    <motion.div
      className={`${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};
