import React from 'react';
import { cn } from './Button';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'purple' | 'info' | 'neutral' | 'danger' | 'marigold' | 'coral' | 'blue';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  // Notion Pill Tag: 9999px radius, 1px subtle hairline, muted analog colors
  const variants = {
    default: 'bg-white/[0.06] text-white/70 border-white/[0.08]',
    neutral: 'bg-white/[0.06] text-white/60 border-white/[0.08]',
    success: 'bg-emerald-500/[0.12] text-emerald-400 border-emerald-500/[0.22]',
    warning: 'bg-[#ffb110]/[0.12] text-[#ffc940] border-[#ffb110]/[0.25]',
    marigold: 'bg-[#ffb110]/[0.12] text-[#ffc940] border-[#ffb110]/[0.25]',
    danger: 'bg-[#f64932]/[0.12] text-[#ff6b57] border-[#f64932]/[0.25]',
    coral: 'bg-[#f64932]/[0.12] text-[#ff6b57] border-[#f64932]/[0.25]',
    info: 'bg-[#0075de]/[0.15] text-[#62aef0] border-[#0075de]/[0.25]',
    blue: 'bg-[#0075de]/[0.15] text-[#62aef0] border-[#0075de]/[0.25]',
    purple: 'bg-purple-500/[0.12] text-purple-400 border-purple-500/[0.22]'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border tracking-tight select-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
