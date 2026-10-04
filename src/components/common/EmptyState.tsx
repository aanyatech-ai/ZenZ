import React from 'react';
import { Rocket } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 glass-panel rounded-3xl border-dashed border-slate-300 dark:border-space-border/60">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-neon-blue/20 to-neon-purple/20 text-neon-cyan flex items-center justify-center mb-4 shadow-[0_0_20px_-3px_rgba(0,242,254,0.2)]">
        {icon || <Rocket className="w-8 h-8 animate-float-slow" />}
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1.5 font-sans">
        {title}
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="neon" size="md" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
