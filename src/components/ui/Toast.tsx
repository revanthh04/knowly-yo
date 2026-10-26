import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

let toastListeners: ((msg: ToastMessage) => void)[] = [];

export const toast = {
  success: (title: string, message?: string) => {
    const msg: ToastMessage = { id: Math.random().toString(), type: 'success', title, message };
    toastListeners.forEach((fn) => fn(msg));
  },
  error: (title: string, message?: string) => {
    const msg: ToastMessage = { id: Math.random().toString(), type: 'error', title, message };
    toastListeners.forEach((fn) => fn(msg));
  },
  info: (title: string, message?: string) => {
    const msg: ToastMessage = { id: Math.random().toString(), type: 'info', title, message };
    toastListeners.forEach((fn) => fn(msg));
  }
};

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const listener = (msg: ToastMessage) => {
      setToasts((prev) => [...prev, msg]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== msg.id));
      }, 4000);
    };
    toastListeners.push(listener);
    return () => {
      toastListeners = toastListeners.filter((fn) => fn !== listener);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#141721] shadow-xl text-slate-900 dark:text-slate-100 transition-all transform translate-y-0"
        >
          {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />}
          {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />}
          {t.type === 'info' && <Info className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />}
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold">{t.title}</h4>
            {t.message && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.message}</p>}
          </div>
          <button
            onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
