import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'sky';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, disabled, children, ...props }, ref) => {
    // Notion buttons: 8px border-radius, 200ms ease transition, no drop-shadows
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-[8px] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0075de]/40 disabled:opacity-40 disabled:pointer-events-none select-none cursor-pointer tracking-tight';

    const variants = {
      // Notion Blue: The single chromatic commitment in the system
      primary: 'bg-[#0075de] hover:bg-[#0060b9] text-white active:scale-[0.99]',
      // Secondary: hairline border on elevated surface
      secondary: 'bg-[#252525] hover:bg-[#2e2e2e] text-[#ebebeb] border border-white/[0.08] active:scale-[0.99]',
      // Outline: minimal hairline border
      outline: 'bg-transparent hover:bg-[#252525] text-[#ebebeb] border border-white/[0.12]',
      // Ghost: text with hover wash
      ghost: 'bg-transparent hover:bg-[#252525] text-white/65 hover:text-white',
      // Sky Tint Ghost CTA (Notion secondary action)
      sky: 'bg-[#0075de]/15 hover:bg-[#0075de]/25 text-[#62aef0]',
      // Notion Coral for danger actions
      danger: 'bg-[#f64932] hover:bg-[#e32d14] text-white'
    };

    const sizes = {
      sm: 'text-xs px-2.5 py-1.5 gap-1.5',
      md: 'text-sm px-3.5 py-1.5 gap-2',
      lg: 'text-base px-5 py-2.5 gap-2.5',
      icon: 'h-8 w-8 p-0'
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && (
          <svg className="animate-spin -ml-0.5 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
