import React from 'react';
import { cn } from './Button';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'purple' | 'info' | 'neutral' | 'danger';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    success: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
    purple: 'bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/30',
    info: 'bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/30',
    danger: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30',
    neutral: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border transition-colors',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
