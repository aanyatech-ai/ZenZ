import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

export type ButtonVariant = 'primary' | 'secondary' | 'neon' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs font-medium rounded-lg gap-1.5',
    md: 'px-4 py-2.5 text-sm font-semibold rounded-xl gap-2',
    lg: 'px-6 py-3.5 text-base font-bold rounded-2xl gap-2.5',
  }[size];

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-neon-blue via-indigo-600 to-neon-purple text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:brightness-110 active:scale-98',
    secondary:
      'glass-panel text-slate-700 dark:text-slate-200 hover:border-neon-cyan/40 hover:text-neon-cyan active:scale-98',
    neon:
      'bg-space-900 border border-neon-cyan/60 text-neon-cyan shadow-[0_0_15px_-3px_rgba(0,242,254,0.3)] hover:shadow-[0_0_22px_-2px_rgba(0,242,254,0.5)] hover:bg-neon-cyan/10 active:scale-98',
    danger:
      'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 active:scale-98',
    ghost:
      'text-slate-600 dark:text-slate-400 hover:text-neon-cyan hover:bg-neon-cyan/10 active:scale-98',
  }[variant];

  return (
    <motion.button
      whileTap={{ scale: disabled || isLoading ? 1 : 0.97 }}
      disabled={disabled || isLoading}
      className={`relative inline-flex items-center justify-center font-sans transition-all duration-200 outline-none focus:ring-2 focus:ring-neon-cyan/50 disabled:opacity-50 disabled:cursor-not-allowed select-none ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
};
