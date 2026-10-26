import React from 'react';
import { LucideIcon, FolderOpen } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon = FolderOpen,
  title,
  description,
  actionLabel,
  onAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12 border-2 border-dashed border-slate-200 dark:border-slate-800/80 rounded-2xl bg-slate-50/50 dark:bg-[#141721]/50 my-4">
      <div className="p-3 bg-violet-500/10 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400 rounded-2xl mb-3">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-4 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
