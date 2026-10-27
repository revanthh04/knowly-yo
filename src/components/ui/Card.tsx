import React from 'react';
import { cn } from './Button';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export function Card({ className, hover = false, children, ...props }: CardProps) {
  // Notion Card: #202020 on #191919 canvas, 12px corners, 1px hairline border, zero drop-shadow
  return (
    <div
      className={cn(
        'rounded-[12px] border border-white/[0.08] bg-[#202020] p-5 transition-colors duration-200',
        hover && 'hover:border-white/[0.18] hover:bg-[#232323] cursor-pointer',
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
    <div className={cn('flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06]', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-[15px] font-semibold text-white/90 tracking-tight', className)} {...props}>
      {children}
    </h3>
  );
}
