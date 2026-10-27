import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from './Button';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export function Modal({ isOpen, onClose, title, description, children, maxWidth = 'lg' }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop with subtle dimming */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Notion Dialog: #202020 surface, 12px corners, 1px hairline border */}
      <div
        className={cn(
          'relative w-full rounded-[12px] bg-[#202020] border border-white/[0.08] p-6 transition-all z-10 max-h-[90vh] flex flex-col',
          maxWidths[maxWidth]
        )}
      >
        <div className="flex items-start justify-between pb-4 border-b border-white/[0.06]">
          <div>
            <h2 className="text-base font-semibold text-white/90 tracking-tight">{title}</h2>
            {description && <p className="text-xs text-white/45 mt-1 leading-relaxed">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[6px] text-white/40 hover:text-white/80 hover:bg-[#252525] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 overflow-y-auto flex-1 pr-1">{children}</div>
      </div>
    </div>
  );
}
