import { useNavigate } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="p-4 rounded-2xl bg-violet-500/10 text-violet-500">
        <Compass className="w-12 h-12" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">404 - Page Not Found</h1>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm">
        The route you are looking for does not exist or has been relocated.
      </p>
      <Button variant="primary" size="sm" onClick={() => navigate('/dashboard')} className="gap-2">
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Button>
    </div>
  );
}
