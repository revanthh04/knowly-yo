import React from 'react';
import { cn } from './Button';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ className, hover = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-[#141721] p-5 shadow-sm transition-all',
        hover && 'hover:border-violet-500/50 hover:shadow-md dark:hover:border-violet-500/40 hover:-translate-y-0.5 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800/60', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-base font-semibold text-slate-900 dark:text-slate-100', className)} {...props}>
      {children}
    </h3>
  );
}
