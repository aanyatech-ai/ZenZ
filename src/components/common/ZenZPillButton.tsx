import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface ZenZPillButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  showArrow?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const ZenZPillButton: React.FC<ZenZPillButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  showArrow = true,
  className = '',
  icon,
  onClick,
  disabled,
  type = 'button',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  }[size];

  const arrowSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
  }[size];

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] text-white shadow-[0_10px_25px_-5px_rgba(236,72,153,0.4)] hover:shadow-[0_12px_30px_-4px_rgba(249,115,22,0.45)] border border-white/30',
    secondary:
      'bg-white/80 dark:bg-[#1E1632]/85 text-purple-900 dark:text-purple-100 hover:bg-white dark:hover:bg-[#251D3D] border border-purple-200/60 dark:border-purple-500/30 shadow-[0_8px_20px_-6px_rgba(139,92,246,0.15)]',
    glass:
      'bg-white/40 dark:bg-white/10 backdrop-blur-md text-slate-800 dark:text-white border border-white/50 dark:border-white/15 hover:bg-white/60 dark:hover:bg-white/15',
  }[variant];

  return (
    <motion.button
      type={type}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.96 }}
      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2.5 rounded-full font-bold tracking-tight select-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${sizeClasses} ${variantClasses} ${className}`}
      {...(props as any)}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {showArrow && (
        <span
          className={`shrink-0 rounded-full bg-white/25 dark:bg-white/20 flex items-center justify-center backdrop-blur-sm transition-transform group-hover:translate-x-0.5 ${arrowSizes}`}
        >
          <ArrowRight className="w-3.5 h-3.5 text-white" />
        </span>
      )}
    </motion.button>
  );
};
