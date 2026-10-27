import React from 'react';
import { cn } from './Button';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-white/70">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'w-full px-3 py-1.5 text-sm rounded-[8px] bg-[#191919] border border-white/[0.1] text-white placeholder-white/30 focus:outline-none focus:border-[#0075de] focus:ring-1 focus:ring-[#0075de]/30 transition-colors',
            error && 'border-[#f64932] focus:border-[#f64932] focus:ring-[#f64932]/30',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[#f64932] font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-white/40">{helperText}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, rows = 3, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={textareaId} className="block text-xs font-medium text-white/70">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          rows={rows}
          className={cn(
            'w-full px-3 py-2 text-sm rounded-[8px] bg-[#191919] border border-white/[0.1] text-white placeholder-white/30 focus:outline-none focus:border-[#0075de] focus:ring-1 focus:ring-[#0075de]/30 transition-colors resize-y leading-relaxed',
            error && 'border-[#f64932] focus:border-[#f64932] focus:ring-[#f64932]/30',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[#f64932] font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-white/40">{helperText}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
